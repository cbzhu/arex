import { CollectionNodeType } from '@/constant';
import { request } from '@/utils';

export type DuplicateCollectionItemReq = {
  id: string;
  infoId: string;
  nodeType: CollectionNodeType;
};

export type DuplicateCollectionItemRes = {
  infoId: string;
  workspaceId: string;
  success: boolean;
};

export async function duplicateCollectionItem(params: DuplicateCollectionItemReq) {
  const res = await request.post<DuplicateCollectionItemRes>(
    `/webApi/filesystem/duplicate`,
    params,
  );
  return res.body;
}
