<template>
<div>
    <div>
        <div id="uri">
            <b-container fluid>
                <b-row>
                    <b-col sm="5">
                        <b-form-input v-model="url1" :type="url" placeholder="Target Resource"></b-form-input>
                    </b-col>
                    <b-col sm="5">
                        <b-form-input v-model="url2" :type="url" placeholder="Target Resource"></b-form-input>
                    </b-col>
                    <b-col sm="1">
                        <b-button @click="getResource">Submit</b-button>
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
    <div id="tree">
        <ul id="treeList" is="tree" :data="treeList">
            <li id="treeList" slot-scope="{item, index, depth}">
                <button id="treeBtn" @click="$set(item,'showChildren',!item.showChildren)">+/-</button> &nbsp;
                <span id="resource">{{item.rn}}</span>
                <ul id="treeList" is="childTree" :data="item.children" v-show="item.showChildren" />
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
        treeList: []   // treeList 빈 리스트로 초기화
      }
    },
    methods: {
        async getResource() {
            var url1 = this.url1;
            var url2 = this.url2;
            var url = url1 + '/viewer' + url2;
            //var url = 'https://4aded162-929f-41b2-904c-fe542272d2d7.mock.pstmn.io/TinyIoT'

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
                }).catch((e) => {
                    console.log(e);
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
    },
  }
</script>

<style>
    #uri {
        margin-top: 15px;
    }
    #radio {
        margin-top: 15px;
        margin-left: 15px;
    }
    #treeList {
        list-style: none;
        margin-top: 5px;
    }
    /* #treeBtn{
        background-color: transparent;
    } */
</style>