<template>
<div>
    <div>
        <div id="uri">
            <b-container fluid>
                <b-row>
                    <b-col sm="5">
                        <b-form-input :id="`url1`" :type="url" placeholder="Target Resource"></b-form-input>
                    </b-col>
                    <b-col sm="5">
                        <b-form-input :id="`url2`" :type="url" placeholder="Target Resource"></b-form-input>
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
    <!-- <div>
        <ul>
            <li v-for="({group, subitems}) in treeGroups" :key="group.ri">
                <span>{{group.rn}}</span>
                <ol>
                    <li v-for="subitem in subitems">-- {{subitem.rn}}</li>
                </ol>
            </li>
        </ul>
    </div> -->
    <div id="tree">
        <ul is="tree" :data="treeList">
            <li slot-scope="{item, index, depth}">
                <button @click="$set(item,'showChildren',!item.showChildren)">+/-</button> &nbsp;
                <span id="resource">{{item.rn}}</span>
                <ul is="childTree" :data="item.children" v-show="item.showChildren" />
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
        treeList: []   // resource를 빈 리스트로 초기화
      }
    },
    methods: {
        async getResource() {
            this.treeList = await this.api(
                'https://1978eb44-90ad-40f8-9978-1ecad4ab1516.mock.pstmn.io/resources',
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
                if (node.pi !== null) {
                // if you have dangling branches check that map[node.parentId] exists
                list[map[node.pi]].children.push(node);
                } else {
                roots.push(node);
                }
            }
            return roots;
        }
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
</style>