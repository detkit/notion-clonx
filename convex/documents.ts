import { v } from 'convex/values';

import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

export const getSidebar = query({
	args: {
		parentDocument: v.optional(v.id('document')),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authenticated');
		}

		const userId = identity.subject;

		const documents = await ctx.db
			.query('document')
			.withIndex('by_user_parent', (q) =>
				q.eq('userId', userId).eq('parentDocument', args.parentDocument)
			)
			.filter((q) => q.eq(q.field('isArchived'), false))
			.order('desc')
			.collect();

		return documents;
	},
});

export const archive = mutation({
	args: { id: v.id('document') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authenticated');
		}

		const userId = identity.subject;

		const existingDocument = await ctx.db.get(args.id);

		if (!existingDocument) {
			throw new Error('Not Found');
		}

		if (existingDocument.userId !== userId) {
			throw new Error('Unauthorized');
		}

		const recusiveArchive = async (documentId: Id<'document'>) => {
			const children = await ctx.db
				.query('document')
				.withIndex('by_user_parent', (q) =>
					q.eq('userId', userId).eq('parentDocument', documentId)
				)
				.collect();

			for (const child of children) {
				await ctx.db.patch(child._id, {
					isArchived: true,
				});

				await recusiveArchive(child._id);
			}
		};

		const document = await ctx.db.patch(args.id, {
			isArchived: true,
		});

		recusiveArchive(args.id);

		return document;
	},
});

export const get = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authenticated');
		}

		const documents = await ctx.db.query('document').collect();

		return documents;
	},
});

export const create = mutation({
	args: {
		title: v.string(),
		parentDocument: v.optional(v.id('document')),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authenticated');
		}

		const userId = identity.subject;

		const document = await ctx.db.insert('document', {
			title: args.title,
			parentDocument: args.parentDocument,
			userId,
			isArchived: false,
			isPublished: false,
		});

		return document;
	},
});

export const getTrash = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authenticated');
		}

		const userId = identity.subject;

		const documents = await ctx.db
			.query('document')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.filter((q) => q.eq(q.field('isArchived'), true))
			.order('desc')
			.collect();

		return documents;
	},
});

export const restore = mutation({
	args: { id: v.id('document') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authenticated');
		}

		const userId = identity.subject;

		const existingDocument = await ctx.db.get(args.id);

		if (!existingDocument) {
			throw new Error('Not Found');
		}

		if (existingDocument.userId !== userId) {
			throw new Error('Unauthorized');
		}

		const recursiveRestore = async (documentId: Id<'document'>) => {
			const children = await ctx.db
				.query('document')
				.withIndex('by_user_parent', (q) =>
					q.eq('userId', userId).eq('parentDocument', documentId)
				)
				.collect();

			for (const child of children) {
				await ctx.db.patch(child._id, {
					isArchived: false,
				});

				await recursiveRestore(child._id);
			}
		};

		const options: Partial<Doc<'document'>> = {
			isArchived: false,
		};

		if (existingDocument.parentDocument) {
			const parent = await ctx.db.get(existingDocument.parentDocument);

			if (parent?.isArchived) {
				options.parentDocument = undefined;
			}
		}

		const document = await ctx.db.patch(args.id, options);

		recursiveRestore(args.id);

		return document;
	},
});

export const remove = mutation({
	args: { id: v.id('document') },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authenticated');
		}

		const userId = identity.subject;

		const existingDocument = await ctx.db.get(args.id);

		if (!existingDocument) {
			throw new Error('Not Found');
		}

		if (existingDocument.userId !== userId) {
			throw new Error('Unauthorized');
		}

		const document = await ctx.db.delete(args.id);

		return document;
	},
});

export const getSearch = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error('Not authenticated');
		}

		const userId = identity.subject;

		const documents = await ctx.db
			.query('document')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.filter((q) => q.eq(q.field('isArchived'), false))
			.order('desc')
			.collect();

		return documents;
	},
});
