/**
 * All Pane Components under panes folder
 * should be created by createArexPane,
 * and export in this index file.
 * Note: In order to get the name of the function component,
 * do not create the function anonymously.
 */

import AppSetting from './AppSetting';
import Environment from './Environment';
import Replay from './Replay';
import ReplayAnalysis from './ReplayAnalysis';
import ReplayCase from './ReplayCase';
import ReplayCaseDetail from './ReplayCaseDetail';
import ReplayDiffScenes from './ReplayDiffScenes';
import Request from './Request';
import UserSetting from './UserSetting';

export default {
  AppSetting,
  Replay,
  ReplayCase,
  ReplayCaseDetail,
  ReplayDiffScenes,
  ReplayAnalysis,
  Request,
  Environment,
  UserSetting,
};
