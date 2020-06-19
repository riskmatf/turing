export default {
	functional: true,
	props: {
		nodes: {},
	},
	render(h, ctx) {
		if (typeof (ctx.props.nodes) === 'object') {
			return ctx.props.nodes
		}

		return h('span', [`${ctx.props.nodes}`])
	}
}
