export class World {
  constructor() {
    this._nextId = 1;
    this._components = new Map();
    this._entities = new Set();
    this._systems = [];
    this._tags = new Map();
    this._toDestroy = [];
  }

  createEntity(tags = []) {
    const id = this._nextId++;
    this._entities.add(id);
    this._tags.set(id, new Set(tags));
    return id;
  }

  destroyEntity(id) {
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

  add(id, name, data) {
    if (!this._components.has(name)) {
      this._components.set(name, new Map());
    }
    this._components.get(name).set(id, data);
    return data;
  }

  get(id, name) {
    const store = this._components.get(name);
    return store ? store.get(id) : undefined;
  }

  has(id, name) {
    const store = this._components.get(name);
    return store ? store.has(id) : false;
  }

  remove(id, name) {
    this._components.get(name)?.delete(id);
  }

  hasTag(id, tag) {
    return this._tags.get(id)?.has(tag) ?? false;
  }

  addTag(id, tag) {
    this._tags.get(id)?.add(tag);
  }

  removeTag(id, tag) {
    this._tags.get(id)?.delete(tag);
  }

  query(...names) {
    let smallest = null;
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
    const result = [];
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

  addSystem(systemFunction) {
    this._systems.push(systemFunction);
  }

  tick(deltaTime) {
    for (const sys of this._systems) {
      sys(this, deltaTime);
    }
    this._flushDestroyed();
  }
}
