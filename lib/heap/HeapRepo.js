"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeapRepo = void 0;
const chatiumApiClient_1 = require("../api/chatiumApiClient");
const errors_1 = require("../errors");
const constants_1 = require("./constants");
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
class HeapRepo {
    constructor(type, fields) {
        this.type = type;
        this.fields = fields;
        /**
         * Creates high-level heap-object from the raw heap-row from the DB.
         */
        this.rawToObject = (hr) => {
            // optimization: create object without prototype
            const result = Object.create(null);
            result.id = hr.id;
            result.createdAt = new Date(hr.created_at);
            result.updatedAt = new Date(hr.updated_at);
            result.createdBy = hr.created_by && { type: constants_1.userRepoType, id: hr.created_by };
            result.updatedBy = hr.updated_by && { type: constants_1.userRepoType, id: hr.updated_by };
            const data = hr.data || Object.create(null);
            for (const name in this.fields) {
                const field = this.fields[name];
                if (field.type === 'link') {
                    result[name] = data[name] ? { type: field.targetType, id: data[name] } : null;
                }
                else if (field.type === 'genLink') {
                    // generic links are represented as plain UUID in HeapObject and doesn't support default value
                    result[name] = data[name] || null;
                }
                else {
                    result[name] = data[name] || field.default;
                }
            }
            return result;
        };
    }
    async findById(ctx, id) {
        const record = await chatiumApiClient_1.chatiumGet(ctx, `/api/v1/heap/${this.type}/${id}`);
        return record ? this.rawToObject(record) : null;
    }
    /**
     * Strictly returns heap object by the given UUID in the context of the current account and type of this repo.
     *  Fails if the id is not found or belongs to other account/type.
     */
    async getById(ctx, id) {
        const result = await this.findById(ctx, id);
        if (result) {
            return result;
        }
        else {
            throw new errors_1.NotFoundError(this.type, id);
        }
    }
    /**
     * Same as getByIds but doesn't throw if some of the IDs not found.
     *  Result length might be less than ids length.
     */
    async findByIds(ctx, ids) {
        if (ids.length === 0) {
            return [];
        }
        const records = await chatiumApiClient_1.chatiumPost(ctx, `/api/v1/heap/${this.type}/get`, ids);
        return records.map(this.rawToObject);
    }
    /**
     * Strictly returns heap object by the given UUID in the context of the current account and type of this repo.
     *  Fails if the id is not found or belongs to other account/type.
     */
    async getByIds(ctx, ids) {
        const result = await this.findByIds(ctx, ids);
        for (const object of result) {
            if (!ids.includes(object.id)) {
                throw new errors_1.NotFoundError(this.type, object.id);
            }
        }
        return result;
    }
    async findAll(ctx) {
        const records = await chatiumApiClient_1.chatiumGet(ctx, `/api/v1/heap/${this.type}`);
        return records.map(this.rawToObject);
    }
    async exists(ctx, id) {
        return chatiumApiClient_1.chatiumGet(ctx, `/api/v1/heap/${this.type}/${id}/exists`);
    }
    async create(ctx, data) {
        const record = await chatiumApiClient_1.chatiumPost(ctx, `/api/v1/heap/${this.type}`, {
            meta: this.fields,
            data,
        });
        return this.rawToObject(record);
    }
    async updateMaybe(ctx, patch) {
        const record = await chatiumApiClient_1.chatiumPost(ctx, `/api/v1/heap/${this.type}/${patch.id}`, {
            meta: this.fields,
            data: patch,
        });
        return record && this.rawToObject(record);
    }
    /**
     * Strict update
     */
    async update(ctx, patch) {
        const result = await this.updateMaybe(ctx, patch);
        if (!result) {
            throw new errors_1.NotFoundError(this.type, patch.id);
        }
        return result;
    }
    async createOrUpdate(ctx, data) {
        const record = await chatiumApiClient_1.chatiumPost(ctx, `/api/v1/heap/${this.type}/${data.id}/createOrUpdate`, {
            meta: this.fields,
            data,
        });
        return this.rawToObject(record);
    }
    async delete(ctx, id) {
        const record = await chatiumApiClient_1.chatiumPost(ctx, `/api/v1/heap/${this.type}/${id}/delete`, {
            meta: this.fields,
        });
        return record && this.rawToObject(record);
    }
}
exports.HeapRepo = HeapRepo;
