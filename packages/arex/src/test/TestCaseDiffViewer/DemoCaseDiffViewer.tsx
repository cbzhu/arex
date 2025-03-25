import { App } from 'antd';
import React, { useState } from 'react';

import CaseDiffViewer, { IgnoreType } from '@/panes/ReplayCase/CaseDiff/CaseDiffViewer';
import { InfoItem } from '@/services/ReportService';

const mockData: InfoItem = {
  id: '123',
  categoryName: 'Mock Category',
  operationName: 'Mock Operation',
  diffResultCode: 1,
  logInfos: [
    {
      logIndex: 0,
      basePath: 'root.value',
      testPath: 'root.value',
    },
  ],
  exceptionMsg: null,
  baseMsg: '{"key": "value"}',
  testMsg: '{"key": "modifiedValue"}',
  code: 'MOCK_CODE', // 确保包含所有 InfoItem 必须的字段
  operationType: 'MOCK_OPERATION_TYPE',
  instanceId: 'MOCK_INSTANCE_ID',
  dependencyId: 'MOCK_DEPENDENCY_ID',
  operationId: 'MOCK_OPERATION_ID',
};

const TestCaseDiffViewer = () => {
  const { message } = App.useApp();
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleChange = (record: React.SetStateAction<null>) => {
    console.log('Changed Record:', record);
    setSelectedRecord(record ?? null);
  };

  const handleIgnoreKey = (path: any[], type: string | number) => {
    message.success(`Ignoring path: ${path.join('.')} with type ${IgnoreType[type]}`);
  };

  const handleSortKey = (path: any[]) => {
    message.info(`Sorting path: ${path.join('.')}`);
  };

  return (
    <App>
      <div style={{ height: '80vh', padding: 20 }}>
        <CaseDiffViewer
          loading={false}
          data={mockData}
          height='100%'
          defaultActiveFirst={true}
          onChange={handleChange}
          onIgnoreKey={handleIgnoreKey}
          onSortKey={handleSortKey}
        />
      </div>
    </App>
  );
};

export default TestCaseDiffViewer;
