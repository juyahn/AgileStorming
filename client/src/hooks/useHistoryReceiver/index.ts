import { EventType } from 'hooks/useHistoryEmitter';
import { SetterOrUpdater } from 'recoil';
import { AddData, IData, IHistories, IHistory } from 'recoil/history';
import { getNextMapState, IMindmapData, IMindNode } from 'recoil/mindmap';
import { getChildLevel } from 'utils/helpers';

export interface IProps {
  mindmap: IMindmapData;
  setMindmap: SetterOrUpdater<IMindmapData>;
  setHistory: SetterOrUpdater<IHistories>;
}

export interface IHistoryReceiver {
  (history: IHistory): void;
}

export interface IHistoryHandlerProps {
  mindmap: IMindmapData;
  setMindmap: SetterOrUpdater<IMindmapData>;
  history: IHistory;
  isForward: boolean;
}

interface IAddNodeProps {
  nextMapState: IMindmapData;
  parentId: number;
  id: number;
  data: IData;
  setMindmap: SetterOrUpdater<IMindmapData>;
}

const TEMP_NODE_ID = -1;

const addNode = ({ data, nextMapState, parentId, id, setMindmap }: IAddNodeProps) => {
  const { content, children } = data.dataTo as AddData;
  const parsedChildren = JSON.parse(children);
  const parent = nextMapState.mindNodes.get(parentId);
  const level = getChildLevel(parent!.level);

  const node = { content, level, nodeId: id, children: parsedChildren };
  const newChildren = [...parent!.children.filter((childId) => childId !== TEMP_NODE_ID), id];
  const newParent = { ...parent!, children: newChildren };

  nextMapState.mindNodes.set(id, node);
  nextMapState.mindNodes.set(parentId, newParent);
  nextMapState.mindNodes.delete(TEMP_NODE_ID);
  setMindmap(nextMapState);
};

const setChangeNodes = (mapState: IMindmapData, nodes: IMindNode[]) => {
  nodes.forEach((node) => mapState.mindNodes.set(node.nodeId, { ...node, children: node.children }));
};

export const historyHandler = ({ mindmap, setMindmap, history, isForward }: IHistoryHandlerProps) => {
  const {
    type,
    data: { nodeTo, nodeFrom, dataFrom, dataTo },
  } = history;
  const nextMapState = getNextMapState(mindmap);

  switch (type) {
    case EventType.ADD_NODE:
      addNode({ nextMapState, parentId: nodeFrom!, id: history.id, data: history.data, setMindmap });
      break;
    case EventType.CHANGE_CONTENT:
    case EventType.CHANGE_SPRINT:
    case EventType.CHANGE_ASSIGNEE:
    case EventType.CHANGE_EXPECTED_AT:
    case EventType.CHANGE_EXPECTED_TIME:
    case EventType.CHANGE_PRIORITY:
      // if (isForward) nextMapState.mindNodes.set(nodeFrom!, dataTo as IMindNode);
      // else nextMapState.mindNodes.set(nodeFrom!, dataFrom as IMindNode);
      break;
    case EventType.MOVE_NODE:
      // if (isForward) setChangeNodes(nextMapState, dataTo as IMindNode[]);
      // else setChangeNodes(nextMapState, dataFrom as IMindNode[]);
      break;
    case EventType.DELETE_NODE:
      if (isForward) nextMapState.mindNodes.delete(nodeFrom!);
      // else nextMapState.mindNodes.set(nodeFrom!, dataFrom as IMindNode);
      break;
    default:
      break;
  }
  setMindmap(nextMapState);
};

const useHistoryReceiver = ({ mindmap, setMindmap, setHistory }: IProps) => {
  const historyReceiver = (history: IHistory) => {
    historyHandler({ mindmap, setMindmap, history, isForward: true });
    setHistory((prev) => ({ histories: [...prev.histories, history] }));
  };
  return historyReceiver;
};
export default useHistoryReceiver;