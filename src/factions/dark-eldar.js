import worker from '../../animations/dark-eldar/worker.json';
import soldier from '../../animations/dark-eldar/soldier.json';

export default {
  name: 'Dark Eldar',
  hq: 'models/dark eldar/structures/kabal_fortress.glb',
  infantry: [
    {
      name: 'Tortured Slave',
      model: 'models/dark eldar/infantry/tortured_slave.glb',
      animations: worker,
      cost: 80,
      time: 2
    },
    {
      name: 'Kabalite Warrior',
      model: 'models/dark eldar/infantry/warrior.glb',
      animations: soldier,
      cost: 100,
      time: 3,
      hiddenNodes: ['dark_eldar_banner', 'dark_eldar_flag_pole']
    },
  ],
  structures: [],
  icons: {},
};
