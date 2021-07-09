
const compNodes = function(as, bs) {
	if (as.length != bs.length) return false
	for (let i=0;i<as.length;i++) {
		const aNodes = as[i]
		const bNodes = bs[i]
		if (aNodes.length != bNodes.length) return false
		for (let j=0;j<aNodes.length;j++) {
			if (aNodes[j].eq(bNodes[j]) == false) return false
		}
	}
	return true
}

const compAttrsArray = function(as, bs) {
	if (!!as != !!bs) return false
	if (as && bs) {
		if (as.length != bs.length) return false
		for (let i=0;i<as.length;i++) {
			const aAttrs = as[i]
			const bAttrs = bs[i]
			// TODO may be we have to use a deep object compare function instead:
			const aKeys = Object.keys(aAttrs)
			const bKeys = Object.keys(bAttrs)
			if (aKeys.length != bKeys.length) return false
			for (let j=0;j<aKeys.length;j++) {
				const aKey = aKeys[j]
				if (aAttrs[aKey] != bAttrs[aKey]) return false
			}
		}
	}
	return true
}

// ::- Hierarchical info of elements with two parts.
export class BiHrcl {
  // :: (int, [[Node]], [[Node]], int, int)
  // Create a hierarchical info.
  constructor(depth, leading, trailing, nofNodes, trailingBreaks = 0) {
		// :: int
	  // Number of the level
    this.depth = depth
		this.leading = leading
		this.trailing = trailing
		this.setLeadingAttrs(Object.create(null))
		this.setTrailingAttrs(Object.create(null))
		// :: int
	  // Original number of nodes including the omitted ones for raising and lowering
		// level(s) and the one or two for separating leading and trailing part
		this.nofNodes = nofNodes
		// :: int
	  // Number of trailing breaks omitted for lowering level(s)
		this.trailingBreaks = trailingBreaks
  }

	// :: (Object)
	// Set the attributes of all leading groups to the given attributes.
	setLeadingAttrs(attrs) {
		if (this.leading) {
			this.leadingAttrs = this.leading.map(nGrp => attrs)
		}
	}

	// :: (Object)
	// Set the attributes of all trailing groups to the given attributes.
	setTrailingAttrs(attrs) {
		if (this.trailing) {
			this.trailingAttrs = this.trailing.map(nGrp => attrs)
		}
	}

	// :: (BiHrcl) → bool
  // Test whether two hierarchical info objects are the same.
  eq(othr) {
		if (this.depth != othr.depth) return false
		if (!!this.leading != !!othr.leading) return false
		if (!!this.trailing != !!othr.trailing) return false
		if (this.nofNodes != othr.nofNodes) return false
		if (this.trailingBreaks != othr.trailingBreaks) return false
		if (this.leading) {
			const res = compNodes(this.leading, othr.leading)
			if (!res) return false
		}
		if (this.trailing) {
			const res = compNodes(this.trailing, othr.trailing)
			if (!res) return false
		}
		// Each group of nodes actually could have got attrs from its origin parent node.
		// In the case of a p with brs the attrs of each group are the same - the one of the p.
		// In the case of an ul/ol-li (with brs) the same holds for the li.
		// But if the node groups originated from a dl, then the attrs could be
		// individual for each group, because they originate either from a dt or dd.
		if (!compAttrsArray(this.leadingAttrs, othr.leadingAttrs)) return false
		if (!compAttrsArray(this.trailingAttrs, othr.trailingAttrs)) return false
		return true
  }
}

export function biHrclsEqual(a, b) {
	if (a.length != b.length) return false
	for (let i=0;i<a.length;i++) {
		const ah = a[i]
		const bh = b[i]
		if (ah.eq(bh) == false) return false
	}
	return true
}
