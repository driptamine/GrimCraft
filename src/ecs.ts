export type EntityId = number;

export type SystemFunction = (world: World, deltaTime: number) => void;

export class World {
  private _nextId = 1;
  private _components = new Map<string, Map<EntityId, unknown>>();
  private _entities = new Set<EntityId>();
  private _systems: SystemFunction[] = [];
  private _tags = new Map<EntityId, Set<string>>();
  private _toDestroy: EntityId[] = [];

  createEntity(tags: string[] = []): EntityId {
    const id = this._nextId++;
    this._entities.add(id);
    this._tags.set(id, new Set(tags));
    return id;
  }

  destroyEntity(id: EntityId) {
    this._toDestroy.push(id);
  }

  _flushDestroyed() {
    for (const id of this._toDestroy) {
      this._entities.delete(id);
      this._tags.delete(id);
      for (const store of this._components.values()) {
        store.delete(id);
      }
    }
    this._toDestroy.length = 0;
  }

  add<T>(id: EntityId, name: string, data: T): T {
    if (!this._components.has(name)) {
      this._components.set(name, new Map());
    }
    (this._components.get(name) as Map<EntityId, unknown>).set(id, data);
    return data;
  }

  get(id: EntityId, name: string): unknown {
    const store = this._components.get(name);
    return store ? store.get(id) : undefined;
  }

  has(id: EntityId, name: string): boolean {
    const store = this._components.get(name);
    return store ? store.has(id) : false;
  }

  remove(id: EntityId, name: string) {
    this._components.get(name)?.delete(id);
  }

  hasTag(id: EntityId, tag: string): boolean {
    return this._tags.get(id)?.has(tag) ?? false;
  }

  addTag(id: EntityId, tag: string) {
    this._tags.get(id)?.add(tag);
  }

  removeTag(id: EntityId, tag: string) {
    this._tags.get(id)?.delete(tag);
  }

  query(...names: string[]): EntityId[] {
    let smallest: Map<EntityId, unknown> | null = null;
    for (const componentName of names) {
      const componentStore = this._components.get(componentName);
      if (!componentStore || componentStore.size === 0) {
        return [];
      }
      if (!smallest || componentStore.size < smallest.size) {
        smallest = componentStore;
      }
    }
    if (!smallest) {
      return [];
    }
    const result: EntityId[] = [];
    for (const id of smallest.keys()) {
      if (!this._entities.has(id)) {
        continue;
      }
      if (names.every((componentName) => this._components.get(componentName)?.has(id))) {
        result.push(id);
      }
    }
    return result;
  }

  addSystem(systemFunction: SystemFunction) {
    this._systems.push(systemFunction);
  }

  tick(deltaTime: number) {
    for (const sys of this._systems) {
      sys(this, deltaTime);
    }
    this._flushDestroyed();
  }
}
