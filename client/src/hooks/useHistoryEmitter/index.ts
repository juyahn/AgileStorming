import useToast from 'hooks/useToast';
import { TAddLabel, TAddSprint, TEventData, TEventType, THistoryEventData, THistoryEventType } from 'types/event';
import { fillPayload } from 'utils/helpers';

export interface IHistoryEmitter {
  (props: IHistoryEmitterProps): void;
}

export interface IHistoryEmitterProps {
  type: THistoryEventType;
  payload: THistoryEventData;
}

export interface INonHistoryEmitterProps {
  type: TEventType;
  payload: TEventData;
}

const useHistoryEmitter = () => {
  const { showMessage } = useToast();

  const historyEmitter = ({ type, payload }: IHistoryEmitterProps) => {
    if (!window.socket) {
      showMessage('서버와의 연결이 불안정합니다');
      return;
    }
    console.log(type, payload);
    payload = fillPayload(payload);
    window.socket.emit('history-event', type, JSON.stringify(payload));
  };

  const nonHistoryEmitter = ({ type, payload }: INonHistoryEmitterProps) => {
    if (!window.socket) {
      showMessage('서버와의 연결이 불안정합니다');
      return;
    }
    window.socket.emit('non-history-event', type, JSON.stringify(payload));
  };

  //* history-event
  const addNode = ({ nodeFrom, dataTo }: THistoryEventData) => historyEmitter({ type: 'ADD_NODE', payload: { nodeFrom, dataTo } });

  const deleteNode = ({ nodeFrom, dataFrom }: THistoryEventData) =>
    historyEmitter({ type: 'DELETE_NODE', payload: { nodeFrom, dataFrom } });

  const moveNode = ({ nodeFrom, nodeTo, dataFrom, dataTo }: THistoryEventData) =>
    historyEmitter({ type: 'MOVE_NODE', payload: { nodeFrom, nodeTo, dataFrom, dataTo } });

  const updateNodeParent = ({ nodeFrom, nodeTo, dataFrom, dataTo }: THistoryEventData) =>
    historyEmitter({ type: 'UPDATE_NODE_PARENT', payload: { nodeFrom, nodeTo, dataFrom, dataTo } });

  const updateNodeSibling = ({ nodeFrom, nodeTo, dataFrom, dataTo }: THistoryEventData) =>
    historyEmitter({ type: 'UPDATE_NODE_SIBLING', payload: { nodeFrom, nodeTo, dataFrom, dataTo } });

  const updateNodeContent = ({ nodeFrom, dataFrom, dataTo }: THistoryEventData) =>
    historyEmitter({ type: 'UPDATE_NODE_CONTENT', payload: { nodeFrom, dataFrom, dataTo } });

  const updateTaskInformation = ({ nodeFrom, nodeTo, dataFrom, dataTo }: THistoryEventData) =>
    historyEmitter({ type: 'UPDATE_TASK_INFORMATION', payload: { nodeFrom, nodeTo, dataFrom, dataTo } });

  //* non-history-event
  const addLabel = ({ name }: TAddLabel) => nonHistoryEmitter({ type: 'ADD_LABEL', payload: { name } });
  const addSprint = ({ name, startDate, endDate }: TAddSprint) =>
    nonHistoryEmitter({ type: 'ADD_SPRINT', payload: { name, startDate, endDate } });

  return {
    addNode,
    deleteNode,
    moveNode,
    updateNodeParent,
    updateNodeSibling,
    updateNodeContent,
    updateTaskInformation,
    addLabel,
    addSprint,
  };
};

export default useHistoryEmitter;
