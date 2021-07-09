const ist = require('ist')
const {schema} = require('prosemirror-schema-basic')
const {builders} = require('prosemirror-test-builder')
const {BiHrcl, biHrclsEqual} = require('..')

const {doc, p, br} = builders(schema, {
  p: {nodeType: 'paragraph'},
	br: {nodeType: 'hard_break'}
})

function t(str, marks) {
	return doc().type.schema.text(str, marks)
}

describe('new BiHrcl', () => {

	it('sets up all fields and empty attributes', () => {
		const act = new BiHrcl(2, [['n1']], [['n2', 'n3'], ['n4']], 7, 8)
		ist(act.depth, 2)
		ist(act.leading instanceof Array)
		if (act.leading instanceof Array) {
			ist(act.leading.length, 1)
			if (act.leading.length == 1) {
				ist(act.leading[0].length, 1)
				if (act.leading[0].length == 1) {
					ist(act.leading[0][0], 'n1')
				}
			}
		}
		ist(act.leadingAttrs instanceof Array)
		if (act.leadingAttrs instanceof Array) {
			ist(act.leadingAttrs.length, 1)
			if (act.leadingAttrs.length == 1) {
				ist(!!act.leadingAttrs[0] && act.leadingAttrs[0] instanceof Array == false)
			}
		}
		ist(act.trailing instanceof Array)
		if (act.trailing instanceof Array) {
			ist(act.trailing.length, 2)
			if (act.trailing.length == 2) {
				ist(act.trailing[0].length, 2)
				if (act.trailing[0].length == 2) {
					ist(act.trailing[0][0], 'n2')
					ist(act.trailing[0][1], 'n3')
				}
				ist(act.trailing[1].length, 1)
				if (act.trailing[1].length == 1) {
					ist(act.trailing[1][0], 'n4')
				}
			}
		}
		ist(act.trailingAttrs instanceof Array)
		if (act.trailingAttrs instanceof Array) {
			ist(act.trailingAttrs.length, 2)
			if (act.trailingAttrs.length == 2) {
				ist(!!act.trailingAttrs[0] && act.trailingAttrs[0] instanceof Array == false)
				ist(!!act.trailingAttrs[1] && act.trailingAttrs[1] instanceof Array == false)
			}
		}
		ist(act.nofNodes, 7)
		ist(act.trailingBreaks, 8)
	})

	it('sets up trailingBreaks to zero by default', () => {
		const act = new BiHrcl(2, [['n1']], [['n2']], 7)
		ist(act.trailingBreaks, 0)
	})

})

describe('BiHrcl.setLeadingAttrs', () => {

	it('sets the attributes of the leading groups', () => {
		const attrs0 = {ex:true}
		const act = new BiHrcl(0, [['n1']], [['n2']], 1)
		act.setLeadingAttrs(attrs0)

		ist(act.leadingAttrs instanceof Array)
		if (act.leadingAttrs instanceof Array) {
			ist(act.leadingAttrs.length, 1)
			if (act.leadingAttrs.length == 1) {
				ist(!!act.leadingAttrs[0] && act.leadingAttrs[0] instanceof Array == false)
				ist(act.leadingAttrs[0].ex === true)
			}
		}
		ist(act.trailingAttrs instanceof Array)
		if (act.trailingAttrs instanceof Array) {
			ist(act.trailingAttrs.length, 1)
			if (act.trailingAttrs.length == 1) {
				ist(!!act.trailingAttrs[0] && act.trailingAttrs[0] instanceof Array == false)
				ist(typeof act.trailingAttrs[0].ex == 'undefined')
			}
		}

	})

})

describe('BiHrcl.setTrailingAttrs', () => {

	it('sets the attributes of the trailing groups', () => {
		const attrs0 = {ex:true}
		const act = new BiHrcl(0, [['n1']], [['n2']], 1)
		act.setTrailingAttrs(attrs0)

		ist(act.leadingAttrs instanceof Array)
		if (act.leadingAttrs instanceof Array) {
			ist(act.leadingAttrs.length, 1)
			if (act.leadingAttrs.length == 1) {
				ist(!!act.leadingAttrs[0] && act.leadingAttrs[0] instanceof Array == false)
				ist(typeof act.leadingAttrs[0].ex == 'undefined')
			}
		}
		ist(act.trailingAttrs instanceof Array)
		if (act.trailingAttrs instanceof Array) {
			ist(act.trailingAttrs.length, 1)
			if (act.trailingAttrs.length == 1) {
				ist(!!act.trailingAttrs[0] && act.trailingAttrs[0] instanceof Array == false)
				ist(act.trailingAttrs[0].ex === true)
			}
		}

	})

})

describe('BiHrcl.eq', () => {

	it('returns true if argument is equal to the instance itself', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		ist(a.eq(b))
	})

	it('returns false if depth is not equal', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(0, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		ist(a.eq(b) == false)
	})

	it('returns false if the number of leading groups is different', () => {
		const a = new BiHrcl(2, [[t('n1')]            ], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('n1')], [t('add')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		ist(a.eq(b) == false)
	})

	it('returns false if the magnitude of a leading group is different', () => {
		const a = new BiHrcl(2, [[t('n1')          ]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('n1'), t('add')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		ist(a.eq(b) == false)
	})

	it('returns false if any node of a leading group is not equal', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('DD')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		ist(a.eq(b) == false)
	})

	it('returns false if any attribute of a leading group is not equal', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		b.leadingAttrs[0] = {ex:true}
		ist(a.eq(b) == false)
	})

	it('returns false if the number of trailing groups is different', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()]           ], 7, 8)
		ist(a.eq(b) == false)
	})

	it('returns false if the magnitude of a trailing group is different', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('n1')]], [[t('n2'),     ], [t('n3')]], 7, 8)
		ist(a.eq(b) == false)
	})

	it('returns false if any node of a trailing group is not equal', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('n1')]], [[t('DD'), br()], [t('n3')]], 7, 8)
		ist(a.eq(b) == false)
	})

	it('returns false if any attribute of a trailing group is not equal', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		a.trailingAttrs[1] = {ax:true}
		const b = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		b.trailingAttrs[1] = {ex:true}
		ist(a.eq(b) == false)
	})

	it('returns false if nofNodes is not equal', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 0, 8)
		ist(a.eq(b) == false)
	})

	it('returns false if trailingBreaks is not equal', () => {
		const a = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 8)
		const b = new BiHrcl(2, [[t('n1')]], [[t('n2'), br()], [t('n3')]], 7, 0)
		ist(a.eq(b) == false)
	})

})

describe('biHrclsEqual', () => {

	it('returns true if all BiHrcl.eq of the array are equal', () => {
		const as = [
			new BiHrcl(1, [[t('n1')]], [], 1),
			new BiHrcl(2, [[t('n2')]], [], 2)
		]
		const bs = [
			new BiHrcl(1, [[t('n1')]], [], 1),
			new BiHrcl(2, [[t('n2')]], [], 2)
		]
		ist(biHrclsEqual(as, bs))
	})

	it('returns false if the sizes of the arrays are different', () => {
		const as = [
			new BiHrcl(1, [[t('n1')]], [], 1),
			new BiHrcl(2, [[t('n2')]], [], 2)
		]
		const bs = [
			new BiHrcl(1, [[t('n1')]], [], 1)
		]
		ist(biHrclsEqual(as, bs) == false)
	})

	it('returns false if any BiHrcl of the array is not equal', () => {
		const as = [
			new BiHrcl(1, [[t('n1')]], [], 1),
			new BiHrcl(2, [[t('n2')]], [], 2)
		]
		const bs = [
			new BiHrcl(1, [[t('n1')]], [], 1),
			new BiHrcl(2, [[t('DD')]], [], 2)
		]
		ist(biHrclsEqual(as, bs) == false)
	})

})
