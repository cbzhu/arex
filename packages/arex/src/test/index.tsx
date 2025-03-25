//const { token } = theme.useToken();
import {
  ContextMenuItem,
  DiffJsonView,
  DiffJsonViewRef,
  isObjectOrArray,
  OnClassName,
  OnRenderContextMenu,
  Parser,
  tryParseJsonString,
} from '@arextest/arex-core';
import { theme } from 'antd';
import React, { FC, useRef } from 'react';

import { DIFF_TYPE } from '@/services/ScheduleService';

const leftJson = '{"code":1,"message":"ok3","data":[{"userName":"newuser","userId":23334}]}';
const rightJson = '{"code":0,"data":[{"userName":"newuser","userId":23334}],"success":true}';

const logEntity = {
  logs: [
    {
      baseValue: null,
      testValue: null,
      logInfo: 'The node value of [companyHouseManageInfoDto] is different : {null} - {null}',
      pathPair: {
        unmatchedType: 3,
        leftUnmatchedPath: [
          {
            nodeName: 'code',
            index: 0,
          },
        ],
        rightUnmatchedPath: [
          {
            nodeName: 'code',
            index: 0,
          },
        ],
        listKeys: [],
        trace: {
          currentTraceLeft: [],
          currentTraceRight: [],
        },
      },
      addRefPkNodePathLeft: null,
      addRefPkNodePathRight: null,
      logTag: {
        errorType: 3,
      },
      warn: 0,
    },
    {
      baseValue: null,
      testValue: null,
      logInfo: 'The node value of [companyHouseManageInfoDto] is different : {null} - {null}',
      pathPair: {
        unmatchedType: 3,
        leftUnmatchedPath: [],
        rightUnmatchedPath: [
          {
            nodeName: 'success',
            index: 0,
          },
        ],
        listKeys: [],
        trace: {
          currentTraceLeft: [],
          currentTraceRight: [],
        },
      },
      addRefPkNodePathLeft: null,
      addRefPkNodePathRight: null,
      logTag: {
        errorType: 3,
      },
      warn: 0,
    },
    {
      baseValue: null,
      testValue: null,
      logInfo: 'The node value of [companyHouseManageInfoDto] is different : {null} - {null}',
      pathPair: {
        unmatchedType: 3,
        leftUnmatchedPath: [
          {
            nodeName: 'message',
            index: 0,
          },
        ],
        rightUnmatchedPath: [],
        listKeys: [],
        trace: {
          currentTraceLeft: [],
          currentTraceRight: [],
        },
      },
      addRefPkNodePathLeft: null,
      addRefPkNodePathRight: null,
      logTag: {
        errorType: 3,
      },
      warn: 0,
    },
  ],
};

const handleClassName: OnClassName = (path, value, target) => {
  const pathString = path.map((p) => p.toString()); // 确保路径格式一致

  console.log('Checking Path:', pathString);
  console.log('Target:', target);

  // 遍历 logs，找到包含当前 path 的 pathPair
  const matchedLog = logEntity.logs.find((log) => {
    const unmatchedPath =
      log.pathPair[`${target}UnmatchedPath`]?.map(
        (item) => item.nodeName || item.index.toString(),
      ) || [];
    console.log('Expected Path:', unmatchedPath);

    // ✅ 只检查 path 是否在 unmatchedPath 里，并且 index 也要匹配上
    return unmatchedPath.some((p, idx) => pathString[idx] === p);
  });

  if (!matchedLog) {
    console.log('No matching log found.');
    return ''; // 如果找不到匹配的 log，则不高亮
  }

  // **🌟 额外检查：确保 leftJson 和 rightJson 真的不同 🌟**
  const leftValue = getJsonValueByPath(leftJson, path); // 获取 left 的值
  const rightValue = getJsonValueByPath(rightJson, path); // 获取 right 的值

  console.log(`Path: ${pathString.join('.')}, Left Value:`, leftValue, 'Right Value:', rightValue);

  if (JSON.stringify(leftValue) === JSON.stringify(rightValue)) {
    console.log('Values are the same, skipping highlight.');
    return ''; // ✅ 如果值相同，就不标记
  }

  const nodeType = {
    left: matchedLog.logTag.nodeErrorType?.baseNodeType,
    right: matchedLog.logTag.nodeErrorType?.testNodeType,
  };

  console.log('Matched Log:', matchedLog);
  console.log('Comparison Result: true');

  return matchedLog.pathPair.unmatchedType === DIFF_TYPE.UNMATCHED
    ? `json-difference-node ${
        nodeType.left !== nodeType.right ? `node-type-${nodeType[target]}` : ''
      }`
    : 'json-additional-node';
};

export function getJsonValueByPath(object?: any, path?: string[], parser?: Parser) {
  // 确保 JSON 解析成功
  const json = tryParseJsonString<Record<string, any>>(object, { parser }) || {};
  if (!path || !path.length) return json;

  return path.reduce((value, key) => {
    if (!value || typeof value !== 'object') return undefined; // 防止 undefined 报错
    return key in value ? value[key] : undefined;
  }, json);
}

const contextMenuRender: OnRenderContextMenu = (path, value, target) => {
  if (!path || !Array.isArray(path)) return []; // 避免 path 为空时报错
  if (value === undefined || value === null) return []; // 避免 value 为空时报错

  const isArrayNode = Array.isArray(value);
  const isLeafNode = value !== undefined && !isObjectOrArray(value);
  const isRootNode = !path.length;

  return [
    {
      type: 'row',
      items: [
        {
          type: 'column',
          items: ([] as ContextMenuItem[])
            .concat(
              isRootNode
                ? []
                : [
                    {
                      type: 'dropdown-button',
                      width: 'max-content',
                      main: {
                        type: 'button',
                        text: '忽略',
                        onClick: () => console.log('忽略键路径:', path),
                      },
                      items: [
                        {
                          type: 'button',
                          text: '全局忽略',
                          onClick: () => console.log('全局忽略:', path),
                        },
                        {
                          type: 'button',
                          text: '接口级忽略',
                          onClick: () => console.log('接口级忽略:', path),
                        },
                        {
                          type: 'button',
                          text: '临时忽略',
                          onClick: () => console.log('临时忽略:', path),
                        },
                      ],
                    },
                  ],
            )
            .concat(
              isArrayNode
                ? [
                    {
                      type: 'button',
                      text: '排序',
                      onClick: () => console.log('排序路径:', path),
                    },
                  ]
                : [],
            )
            .concat(
              isLeafNode
                ? [
                    {
                      type: 'button',
                      text: '解码 Base64',
                      onClick: () => {
                        try {
                          const decoded = atob(value as string);
                          console.log('解码结果:', decoded);
                        } catch (e) {
                          console.error('Base64 解码失败', e);
                        }
                      },
                    },
                  ]
                : [],
            ),
        },
      ],
    },
  ] as ContextMenuItem[];
};

const Test: FC = () => {
  const jsonDiffViewRef = useRef<DiffJsonViewRef>(null);

  return (
    <DiffJsonView
      ref={jsonDiffViewRef}
      diffJson={{
        left: leftJson || '',
        right: rightJson || '',
      }}
      onClassName={handleClassName}
      // onClassName={(path, value, target) => {
      //   const leftValue = getJsonValueByPath(leftJson, path); // 获取 left 的值
      //   const rightValue = getJsonValueByPath(rightJson, path); // 获取 right 的值

      //   console.log(`Path: ${path.join('.')}, Left:`, leftValue, 'Right:', rightValue);

      //   if (leftValue !== undefined && rightValue === undefined) {
      //     return 'json-additional-refer-node'; // 删除的节点
      //   }
      //   if (leftValue === undefined && rightValue !== undefined) {
      //     return 'json-additional-node'; // 新增的节点
      //   }
      //   if (leftValue !== rightValue) {
      //     return 'json-difference-node';  // 修改的节点
      //   }
      //   return '';
      // }}

      //onRenderContextMenu={() => false}
      onRenderContextMenu={contextMenuRender}
      //onClassName={handleClassName}
      //onRenderContextMenu={contextMenuRender}
    />
  );
};

export default Test;
