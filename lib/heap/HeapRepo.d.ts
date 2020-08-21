import type { CreateFields, HeapData, HeapFieldMetas, HeapId, HeapObject, HeapObjectBase, HeapObjectType, UpdateFields } from './types';
import type { AccountCtx, AppCtx, AuthCtx } from '../context';
declare type ReadHeapCtx = AccountCtx & AppCtx & AuthCtx;
declare type WriteHeapCtx = AccountCtx & AppCtx & AuthCtx;
/**
 * Generic repository for the heap-stored objects.
 * Usage:
 *   ```
 *   const issueRepo = new HeapRepo<IssueData>('tracker.Issue', {
 *     title: {
 *       type: 'text',
 *     },
 *   })
 *
 *   const issue = await issueRepo.getById('1234sdfersd')
 *   ```
 */
export declare class HeapRepo<HD extends HeapData, Required extends keyof HD = keyof HD> {
    readonly type: HeapObjectType;
    private fields;
    /**
     * Allows to refer to data field name (key) type of this repo as someRepo['FieldName']
     */
    FieldName: keyof HD;
    constructor(type: HeapObjectType, fields: HeapFieldMetas<HD>);
    findById(ctx: ReadHeapCtx, id: HeapId): Promise<HeapObject<HD> | null>;
    /**
     * Strictly returns heap object by the given UUID in the context of the current account and type of this repo.
     *  Fails if the id is not found or belongs to other account/type.
     */
    getById(ctx: ReadHeapCtx, id: HeapId): Promise<HeapObject<HD>>;
    /**
     * Same as getByIds but doesn't throw if some of the IDs not found.
     *  Result length might be less than ids length.
     */
    findByIds(ctx: ReadHeapCtx, ids: HeapId[]): Promise<HeapObject<HD>[]>;
    /**
     * Strictly returns heap object by the given UUID in the context of the current account and type of this repo.
     *  Fails if the id is not found or belongs to other account/type.
     */
    getByIds(ctx: ReadHeapCtx, ids: HeapId[]): Promise<HeapObject<HD>[]>;
    findAll(ctx: ReadHeapCtx): Promise<HeapObject<HD>[]>;
    exists(ctx: ReadHeapCtx, id: HeapId): Promise<boolean>;
    create(ctx: WriteHeapCtx, fields: CreateFields<HD, Required>): Promise<HeapObject<HD>>;
    updateMaybe(ctx: WriteHeapCtx, patch: Partial<UpdateFields<HD>> & Pick<HeapObjectBase, 'id'>): Promise<HeapObject<HD> | null>;
    /**
     * Strict update
     */
    update(ctx: WriteHeapCtx, patch: Partial<UpdateFields<HD>> & Pick<HeapObjectBase, 'id'>): Promise<HeapObject<HD>>;
    createOrUpdate(ctx: WriteHeapCtx, fields: CreateFields<HD, Required> & {
        id: HeapId;
    }): Promise<HeapObject<HD>>;
    delete(ctx: WriteHeapCtx, id: HeapId): Promise<HeapObject<HD> | null>;
    /**
     * Creates high-level heap-object from the raw heap-row from the DB.
     */
    private rawToObject;
}
export {};
