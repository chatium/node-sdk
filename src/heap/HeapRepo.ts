import { chatiumGet, chatiumPost } from '../api/chatiumApiClient'
import type { AccountCtx, AppCtx } from '../context'
import { NotFoundError } from '../errors'
import { userRepoType } from './constants'
import type {
  CreateFields,
  HeapData,
  HeapFieldMeta,
  HeapFieldMetas,
  HeapId,
  HeapLink,
  HeapObject,
  HeapObjectBase,
  HeapObjectType,
  HeapRecord,
  UpdateFields,
  UserData,
} from './types'
import { AuthCtx } from '../ChatiumAuth'

type ReadHeapCtx = AccountCtx & AppCtx & AuthCtx
type WriteHeapCtx = AccountCtx & AppCtx & AuthCtx

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
export class HeapRepo<HD extends HeapData, Required extends keyof HD = keyof HD> {
  /**
   * Allows to refer to data field name (key) type of this repo as someRepo['FieldName']
   */
  declare FieldName: keyof HD

  constructor(public readonly type: HeapObjectType, private fields: HeapFieldMetas<HD>) {}

  async findById(ctx: ReadHeapCtx, id: HeapId): Promise<HeapObject<HD> | null> {
    const record = await chatiumGet<HeapRecord | null>(ctx, `/api/v1/heap/${this.type}/${id}`)

    return record ? this.rawToObject(record) : null
  }

  /**
   * Strictly returns heap object by the given UUID in the context of the current account and type of this repo.
   *  Fails if the id is not found or belongs to other account/type.
   */
  async getById(ctx: ReadHeapCtx, id: HeapId): Promise<HeapObject<HD>> {
    const result = await this.findById(ctx, id)

    if (result) {
      return result
    } else {
      throw new NotFoundError(this.type, id)
    }
  }

  /**
   * Same as getByIds but doesn't throw if some of the IDs not found.
   *  Result length might be less than ids length.
   */
  async findByIds(ctx: ReadHeapCtx, ids: HeapId[]): Promise<HeapObject<HD>[]> {
    if (ids.length === 0) {
      return []
    }

    const records = await chatiumPost<HeapRecord[]>(ctx, `/api/v1/heap/${this.type}/get`, ids)

    return records.map(this.rawToObject)
  }

  /**
   * Strictly returns heap object by the given UUID in the context of the current account and type of this repo.
   *  Fails if the id is not found or belongs to other account/type.
   */
  async getByIds(ctx: ReadHeapCtx, ids: HeapId[]): Promise<HeapObject<HD>[]> {
    const result = await this.findByIds(ctx, ids)

    for (const object of result) {
      if (!ids.includes(object.id)) {
        throw new NotFoundError(this.type, object.id)
      }
    }

    return result
  }

  async findAll(ctx: ReadHeapCtx): Promise<HeapObject<HD>[]> {
    const records = await chatiumGet<HeapRecord[]>(ctx, `/api/v1/heap/${this.type}`)
    return records.map(this.rawToObject)
  }

  async exists(ctx: ReadHeapCtx, id: HeapId): Promise<boolean> {
    return chatiumGet<boolean>(ctx, `/api/v1/heap/${this.type}/${id}/exists`)
  }

  async create(ctx: WriteHeapCtx, data: CreateFields<HD, Required>): Promise<HeapObject<HD>> {
    const record = await chatiumPost<HeapRecord>(ctx, `/api/v1/heap/${this.type}`, {
      meta: this.fields,
      data,
    })

    return this.rawToObject(record)
  }

  async updateMaybe(
    ctx: WriteHeapCtx,
    patch: Partial<UpdateFields<HD>> & Pick<HeapObjectBase, 'id'>,
  ): Promise<HeapObject<HD> | null> {
    const record = await chatiumPost<HeapRecord | null>(ctx, `/api/v1/heap/${this.type}/${patch.id}`, {
      meta: this.fields,
      data: patch,
    })

    return record && this.rawToObject(record)
  }

  /**
   * Strict update
   */
  async update(
    ctx: WriteHeapCtx,
    patch: Partial<UpdateFields<HD>> & Pick<HeapObjectBase, 'id'>,
  ): Promise<HeapObject<HD>> {
    const result = await this.updateMaybe(ctx, patch)
    if (!result) {
      throw new NotFoundError(this.type, patch.id)
    }
    return result
  }

  async createOrUpdate(ctx: WriteHeapCtx, data: CreateFields<HD, Required> & { id: HeapId }): Promise<HeapObject<HD>> {
    const record = await chatiumPost<HeapRecord>(ctx, `/api/v1/heap/${this.type}/${data.id}/createOrUpdate`, {
      meta: this.fields,
      data,
    })

    return this.rawToObject(record)
  }

  async delete(ctx: WriteHeapCtx, id: HeapId): Promise<HeapObject<HD> | null> {
    const record = await chatiumPost<HeapRecord | null>(ctx, `/api/v1/heap/${this.type}/${id}/delete`, {
      meta: this.fields,
    })

    return record && this.rawToObject(record)
  }

  /**
   * Creates high-level heap-object from the raw heap-row from the DB.
   */
  private rawToObject = (hr: HeapRecord): HeapObject<HD> => {
    // optimization: create object without prototype
    const result = Object.create(null)

    result.id = hr.id
    result.createdAt = new Date(hr.created_at)
    result.updatedAt = new Date(hr.updated_at)
    result.createdBy = hr.created_by && ({ type: userRepoType, id: hr.created_by } as HeapLink<UserData>)
    result.updatedBy = hr.updated_by && ({ type: userRepoType, id: hr.updated_by } as HeapLink<UserData>)

    const data: any = hr.data || Object.create(null)

    for (const name in this.fields) {
      const field = this.fields[name as this['FieldName']] as HeapFieldMeta<unknown>
      if (field.type === 'link') {
        result[name] = data[name] ? { type: field.targetType, id: data[name] } : null
      } else if (field.type === 'genLink') {
        // generic links are represented as plain UUID in HeapObject and doesn't support default value
        result[name] = data[name] || null
      } else {
        result[name] = data[name] || field.default
      }
    }

    return result
  }
}
