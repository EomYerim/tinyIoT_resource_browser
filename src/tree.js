export default function install( Vue ) {
    Vue.component( 'tree', {
        name : 'tree',
        props : [ 'data', 'tag', '_depth' ],
        render( h ) {
            var data = this.$props.data || []
            var tag = this.$props.tag || this.$vnode.data.tag || 'ul'
            var depth = this.$props._depth || 0
            var slot = this.$scopedSlots.default

            var children = data.map( ( d, i ) => {
                var context = { item : d, index : i, depth : depth }
                return slot( context )
            })

            return h( tag, children )
        }
    })

    function findParentTree( vm ) {
        if( !vm )
            return null
        if( vm.$vnode && vm.$vnode.componentOptions &&
            vm.$vnode.componentOptions.tag === 'tree' )
            return vm
        if( !vm.$parent )
            return null
        return findParentTree( vm.$parent )
    }

    Vue.component( 'childTree', {
        name : 'childTree',
        props : [ 'data', 'tag' ],
        render( h ) {
            var parentTree = findParentTree( this )
            if( !parentTree )
                return h( '' )

            var data = this.$props.data || []
            var tag = this.$props.tag || this.$vnode.data.tag || 'ul'
            var parentDepth = parentTree.$props._depth || 0
            var slot = parentTree.$scopedSlots.default

            if( !slot )
                return h( tag )

            return h( 'tree', {
                props : { data : data, tag : tag, _depth : parentDepth + 1 },
                scopedSlots : { default : slot }
            })
        }
    })
}
