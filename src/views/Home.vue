<template>
<div>
    <div>
        <div id="url">
            <b-container fluid>
                <b-row>
                    <b-col cols="5">
                        <b-form-input v-model="url1" :type="url" placeholder="Target Resource"></b-form-input>
                    </b-col>
                    <b-col cols="5">
                        <b-form-input v-model="url2" :type="url" placeholder="Target Resource"></b-form-input>
                    </b-col>
                    <b-col id="alignBtn">
                        <b-button class="btn" @click="getResource">Submit</b-button>
                        <b-button class="btn" @click="allClear">Reset</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </div>
        <div id="radio">
            <b-form-group
                label="Number of Instance"
                v-slot="{ ariaDescribedby }">
                <b-form-radio-group plain
                    v-model="show"
                    :aria-describedby="ariaDescribedby">
                    <b-form-radio value="1"> 1 Latest</b-form-radio>
                    <b-form-radio value="3"> 3 Latest</b-form-radio>
                    <b-form-radio value="5"> 5 Latest</b-form-radio>
                </b-form-radio-group>
            </b-form-group>
        </div>
        <hr>
    </div>
    <div>
        <ul is="tree" :data="treeList"> <!-- <ul>이 tree 컴포넌트가 된다 -->
            <li slot-scope="{item, index, depth}">  <!-- scoped slot 정의 -->
                <button id="treeBtn" @click="$set(item,'showChildren',!item.showChildren)">+/-</button> &nbsp;
                <span rel="tooltip" v-b-tooltip.hover.html.right="'ty: ' + item.ty + '<br/>' + 'ri: ' + item.ri+ '<br/>' + 'rn: ' + item.rn">{{item.rn}}</span>    <!-- scoped slot으로 전달되는 컨텍스트 데이터를 통해 노드 외형 정의 -->
                <ul is="childTree" :data="item.children" v-show="item.showChildren" /> <!-- 하위 Tree가 렌더링 될 위치, children 컴포넌트가 된다 -->
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import axios from 'axios'

  export default {
    name: "Home",
    data() {
      return {
        url1: '',
        url2: '',
        num: 0,
        treeList: [],   // treeList 빈 리스트로 초기화
      }
    },
    methods: {
        async getResource() {
            var url1 = this.url1;
            var url2 = this.url2;
            //var url = url1 + '/viewer' + url2;
            //var url = 'https://4aded162-929f-41b2-904c-fe542272d2d7.mock.pstmn.io/TinyIoT'
            //OM2M
            var url = 'http://34.64.70.229:8080/in-name/ISPTech_bus_shelter'
            //var url = url + url2;

            this.treeList = await this.api(
                url,
                'get',
                {}
            );
            this.treeList = await this.list_to_tree(this.treeList)
            console.log(this.treeList);
        },
        async api(url, method, data) {
            return (
                await axios({
                    method: method,
                    url: url,
                    data: data,
                    headers: {
                        "X-M2M-Origin": "admin:admin"
                    }
                }).catch((e) => {
                    console.log(e);
                    if (e.response) {
                        this.$swal.fire({
                            title: '대상 서버에 접속할 수 없습니다',
                            text: 'Unable to access destination server',
                            icon: 'error'
                        })
                    }
                })
            ).data;
        },

        async list_to_tree(list) {
            var map = {}, node, roots = [], i;
            
            for (i = 0; i < list.length; i += 1) {
                map[list[i].ri] = i; // initialize the map
                list[i].children = []; // initialize the children
            }
            
            for (i = 0; i < list.length; i += 1) {
                node = list[i];
                if (node.pi !== "NULL") {
                    // if you have dangling branches check that map[node.parentId] exists
                    list[map[node.pi]].children.push(node);
                } else {
                    roots.push(node);
                }
            }
            return roots;
        },

        async allClear() {
            this.url1 = '';
            this.url2 = '';
            this.treeList = [];
        }
    },
  }
</script>

<style>
    #url {
        margin-top: 20px;
    }
    #radio {
        margin-top: 15px;
        margin-left: 15px;
    }

    #alignBtn {
        text-align: center;
    }
    .btn {
        margin-right: 10px;
        display: inline-block;
    }

    ul {
        list-style: none;
    }
    li {
        margin-top: 5px;
    }
    ul span:hover {
        font-weight: bold;
    }
    .tooltip-inner {
        text-align: left!important;
        margin: 10px;
    }

</style>