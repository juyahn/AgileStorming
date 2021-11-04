import React from 'react';
import styled from '@emotion/styled';
import { IMindNode, IMindMap } from 'recoil/mindMap';
import Node from 'components/atoms/Node';

interface IProps {
  mindMap: IMindMap;
}

interface IStyleProps {
  isRoot: boolean;
}

const NodeContainer = styled.div<IStyleProps>`
  ${(props) => props.theme.flex.center};
  ${(props) => props.isRoot && props.theme.absoluteCenter};
  gap: 1rem;
  border: 1px solid blue;
`;

const ChildContainer = styled.div`
  ${(props) => props.theme.flex.column};
  gap: 1rem;
`;

const getNodeContainer = (nodeId: number, mindNodes: Map<number, IMindNode>) => {
  const isRoot = nodeId === 0;
  const node = mindNodes.get(nodeId);
  const { level, content, children } = node!;
  return (
    <NodeContainer key={nodeId} isRoot={isRoot} draggable='true'>
      <Node id={nodeId.toString()} level={level}>
        {content}
      </Node>
      <ChildContainer>{children.map((childrenId) => getNodeContainer(childrenId, mindNodes))}</ChildContainer>
    </NodeContainer>
  );
};

const MindMapTree: React.FC<IProps> = ({ mindMap }) => {
  const { rootId, mindNodes } = mindMap;

  return getNodeContainer(rootId, mindNodes);
};

export default MindMapTree;