# prosemirror-br-encoded-hierarchy-paragraph

[ [**CHANGELOG**](https://github.com/thomasgafner/prosemirror-br-encoded-hierarchy-base/blob/master/CHANGELOG.md) ]

This is a utility module for writing transformations for [ProseMirror](https://prosemirror.net).

Use this module to interpret leading and trailing line breaks (br) in paragraphs as a hint for levels of a hierarchy.
Two line breaks in the middle of a paragraph indicate, that the content at a given position is split into two groups: A leading and a trailing one. If there are several double or multiple line breaks in the middle of the content, only the first one is separating. The others are considered being content.

# Motivation

You want a consistent way of transforming back and forth hierarchical structures like nested lists or definition lists to flat paragraphs with line breaks in html.

# How it is done

Leading or trailing line breaks are converted to a general structure representing the hierarchical structure. That structure is then used by other modules to establish the according list or definition list nodes (or any other hierarchical node setup) in a ProseMirror document.

# Example

An array of `BiHrcl` is used as general structure to represent the following example test setup:
1. A
2. B
   * x
   * y
3. C

```javascript
import {schema} from 'prosemirror-schema-basic'
import {builders} from 'prosemirror-test-builder'
import {BiHrcl} from 'prosemirror-br-encoded-hierarchy-base'

const {doc, p, br} = builders(schema, {
  p: {nodeType: 'paragraph'},
	br: {nodeType: 'hard_break'}
})

function t(str, marks) {
	return doc().type.schema.text(str, marks)
}

const setup = [
	new BiHrcl(0, [[t('A')]], [], 1),
	new BiHrcl(0, [[t('B')]], [], 1),
	new BiHrcl(1, [[t('x')]], [], 1),
	new BiHrcl(1, [[t('y')]], [], 1),
	new BiHrcl(0, [[t('C')]], [], 1)
]

```
The setup is always a flat array, but the depth value - first argument of `BiHrcl` - makes the hierarchy.
In a real use case the nodes are extracted from an actual document by using functions like `Node.child`, `Node.forEach` or others.

A more complex example might look like this:
1. A
2. B1  
B2  
~  
b  
~
  * X  
x
  * Y  
y1  
y2
3. C

The ~ represents an empty line.

```javascript
const setup = [
	new BiHrcl(0, [[t('A')]], [], 1),
	new BiHrcl(0, [[t('B1')], [t('B2')]], [[t('b'), br()]], 7),
	new BiHrcl(1, [[t('X')]], [[t('x')]], 3),
	new BiHrcl(1, [[t('Y')]], [[t('y1')],[t('y2')]], 5),
	new BiHrcl(0, [[t('C')]], [], 1)
]
```

# License

This code is released under an
[MIT license](https://github.com/thomasgafner/prosemirror-br-encoded-hierarchy-base/tree/master/LICENSE).
