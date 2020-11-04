/**
 * Plain raw heap DB record representation
 */
export interface HeapRecord {
  id: HeapId
  data: object | null
  created_by: HeapId | null | undefined
  created_at: Date
  updated_by: HeapId | null | undefined
  updated_at: Date
}

/**
 * Base interface for all heap-objects.
 * Includes all common fields, not fields stored in json `data` field
 */
export interface HeapObjectBase {
  id: HeapId
  createdAt: Date
  updatedAt: Date
  createdBy: HeapLink<UserData> | null
  updatedBy: HeapLink<UserData> | null
}

export type HeapId = string
export type HeapObjectType = string

export type HeapData = {}

/**
 * Composes full heap-object type (that is returned by most HeapRepo methods) from custom `data` field type.
 * Links in `data` type must be defined as another fule HeapObject types
 *  and properly mapped to HeapLink type for runtime operation with links (`getLink` function).
 */
export type HeapObject<HD extends HeapData> = HeapObjectBase & MapHeapLinks<HD>

type MapHeapLinks<HD extends HeapData> = {
  [K in keyof HD]: LinksMap<HD[K]>
}

/**
 * Properly maps link-fields when composing HeapObject from `data` type
 */
type LinksMap<T> = T extends null
  ? null
  : T extends GenericLink
  ? HeapId
  : T extends RefLink<HeapData>
  ? HeapLink<T>
  : T

export type GenericLink = { '~~generic~link~tag~~': never }
export type RefLink<HD extends HeapData> = HD & { '~~ref~link~tag~~': never }
/**
 * Companion for RefLink, removes type-tag field
 * @internal shouldn't be used in end-user code
 */
export type EraseRefLink<RL extends RefLink<HeapData>> = Omit<RL, '~~ref~link~tag~~'>

export interface HeapLink<_HD extends HeapData> {
  type: HeapObjectType
  id: HeapId
}

export interface UserData extends HeapData {
  authId: number
  // roles: UserRole[]
  // status: UserStatus
  expiresAt: string | null
  // avatar: Icon
  firstName: string | null
  lastName: string | null
  phone: string | null
  email: string | null
}

/**
 * Meta-information for different heap field types
 */
export type HeapFieldMeta<JT> =
  | IntMeta
  | TextMeta<JT>
  | BooleanMeta
  | RefLinkMeta<JT>
  | GenericLinkMeta
  | EnumMeta<JT>
  | NumEnumMeta<JT>
  | ObjectMeta<JT>

interface FieldMeta<JT> {
  default?: JT
  required?: boolean
}

export interface IntMeta extends FieldMeta<number> {
  type: 'int'
}

export interface TextMeta<JT> extends FieldMeta<JT> {
  type: 'text'
}

export interface BooleanMeta extends FieldMeta<boolean> {
  type: 'boolean'
}

export interface RefLinkMeta<JT> extends FieldMeta<JT> {
  type: 'link'
  targetType: HeapObjectType
}

export interface GenericLinkMeta extends FieldMeta<HeapObjectBase> {
  type: 'genLink'
}

export interface EnumMeta<JT> extends FieldMeta<JT> {
  type: 'enum'
  values: string[]
}

export interface NumEnumMeta<JT> extends FieldMeta<JT> {
  type: 'nenum'
  values: number[]
}

export interface ObjectMeta<JT> extends FieldMeta<JT> {
  type: 'object'
}

/**
 * Projection of data-fields of the heap object to their corresponding metas
 */
export type HeapFieldMetas<HD extends HeapData> = {
  [K in keyof HD]: JsFieldTypeToMeta<HD[K]>
}

export type JsFieldTypeToMeta<JT> = JT extends number
  ? IntMeta | NumEnumMeta<JT>
  : JT extends string
  ? TextMeta<JT> | EnumMeta<JT>
  : JT extends boolean
  ? BooleanMeta
  : JT extends GenericLink
  ? GenericLinkMeta
  : JT extends RefLink<HeapData>
  ? RefLinkMeta<JT>
  : JT extends object
  ? ObjectMeta<JT>
  : never

/**
 * Maps original `data` type to type accepted by heap-repo's `create` method,
 *  taking into account required fields and mapping link-types to accept IDs
 */
export type CreateFields<HD extends HeapData, Required extends keyof HD> = Partial<UpdateFields<HD>> &
  Pick<UpdateFields<HD>, Exclude<Required, keyof HeapData>> & { id?: HeapId }

/**
 * Maps original `data` type to type accepted by heap-repo's `update` method,
 *  mapping link-types to accept IDs
 */
export type UpdateFields<HD extends HeapData> = {
  [K in keyof HD]: ForUpdate<HD[K]>
}

/**
 * Allow HeapLink fields to be passed as raw ID when creating or updating
 */
type ForUpdate<T> = T extends GenericLink
  ? HeapObjectBase | HeapId
  : T extends RefLink<HeapData>
  ? HeapObject<EraseRefLink<T>> | HeapId
  : T

export type MapFilterLinks<HD extends HeapData> = {
  [K in keyof HD]: FilterLinksMap<HD[K]>
}

/**
 * Link-fields are represented as plain heap IDs in json 'data' field
 */
type FilterLinksMap<T> = T extends null
  ? null
  : T extends GenericLink
  ? HeapId
  : T extends RefLink<HeapData>
  ? HeapId
  : T
