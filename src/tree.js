export default function install( Vue ) {
    Vue.component( 'tree', {
        name : 'tree',
        props : [ 'data', 'tag', '_depth' ],    //depth는 내부적으로 전달용이기 때문에 _를 붙임
        render( h ) {
            var data = this.$props.data || []   //전달된 data
            var tag = this.$props.tag || this.$vnode.data.tag || 'ul'
            var depth = this.$props._depth || 0 //루트 Tree는 depth를 전달받지 않았으므로 0으로
            var slot = this.$scopedSlots.default

            //data 배열만큼 scoped slot을 호출해서 노드를 생성한다
            var children = data.map( ( d, i ) => {
                var context = { item : d, index : i, depth : depth }    //scoped slot으로 전달할 context 객체를 만든다
                return slot( context )  //scoped slot을 호출해서 노드 템플리트를 생성
            })

            return h( tag, children )
        }
    })

    //$parent를 통해 상위로 올라가면서 Tree 컴포넌트를 찾는 함수
    function findParentTree( vm ) {
        if( !vm )
            return null
        if( vm.$vnode && vm.$vnode.componentOptions &&
            vm.$vnode.componentOptions.tag === 'tree' ) //컴포넌트의 tag가 tree의 인스턴스를 찾는다
            return vm
        if( !vm.$parent )
            return null
        return findParentTree( vm.$parent ) //$parent를 통해 상위로 이동
    }

    Vue.component( 'childTree', {
        name : 'childTree',
        props : [ 'data', 'tag' ],
        render( h ) {
            var parentTree = findParentTree( this ) //상위 Tree 컴포넌트를 찾는다
            if( !parentTree )
                return h( '' )

            var data = this.$props.data || []   //자신에게 전달된 data
            var tag = this.$props.tag || this.$vnode.data.tag || 'ul'
            var parentDepth = parentTree.$props._depth || 0 //상위 Tree 컴포넌트의 depth를 가져옴
            var slot = parentTree.$scopedSlots.default  //상위 Tree 컴포넌트의 scoped slot을 가져옴

            if( !slot )
                return h( tag )

            //Tree 컴포넌트를 다시 렌더링함으로써 재귀적으로 하위 Tree를 생성되게 한다
            return h( 'tree', {
                props : { data : data, tag : tag, _depth : parentDepth + 1 },   //하위 Tree에 전달할 props, depth는 +1을 해서 전달
                scopedSlots : { default : slot }    //하위 Tree에 상위 scoped slot을 그대로 전달한다
            })
        }
    })
}
