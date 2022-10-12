<template>
    <div class="wrapper">
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
                        <b-button class="btn" @click="resetAll">Reset</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </div>
        <div id="radio">
            <b-form-group
                label="Number of Instance"
                v-slot="{ ariaDescribedby }">
                <b-form-radio-group plain
                    v-model="latest"
                    @change="getResource"
                    :options="options"
                    :aria-descibedby="ariaDescribedy"
                    name="numOfCIN"
                ></b-form-radio-group>
            </b-form-group>
        </div>
        <hr>
        <section>
            <ul id="tree" is="tree" :data="treeList"> <!-- <ul>이 tree 컴포넌트가 된다 -->
                <li slot-scope="{item, index, depth}">  <!-- scoped slot 정의 -->
                    <button id="treeBtn" @click="$set(item,'showChildren',!item.showChildren)">+/-</button> &nbsp;
                    <span
                        :class="{blink: new_rn === item.rn}"
                    >    <!-- scoped slot으로 전달되는 컨텍스트 데이터를 통해 노드 외형 정의 -->
                        <span v-if="item.ty === 5">
                            <b-badge variant="warning">CSE</b-badge>
                        </span>
                        <span v-if="item.ty === 2">
                            <b-badge variant="info">AE</b-badge>
                        </span>
                        <span v-if="item.ty === 3">
                            <b-badge variant="danger">CNT</b-badge>
                        </span>
                        <span v-if="item.ty === 4">
                            <b-badge variant="success">CIN</b-badge>
                        </span>
                        <span v-if="item.ty == 23">
                            <b-badge variant="secondary">SUB</b-badge>
                        </span>
                        <span
                            @contextmenu.prevent.stop="handleRightClick($event, item)"  
                        >
                            {{item.rn}} <!-- 리소스 우클릭 시 CRD contextMenu -->
                        </span>
                    </span>
                    <ul is="childTree" :data="item.children" v-show="item.showChildren" /> <!-- 하위 Tree가 렌더링 될 위치, children 컴포넌트가 된다 -->
                </li>
            </ul>
        </section>
        <aside>
            <div class="create" v-if="selectedContextMenu === 'c'">
                <div id="info">Create a child resource</div>
                <div id="content">
                    <p>1. Select resource type</p>
                        <label>
                            <input type="radio" value="cnt" v-model="selectedResource" @click="resetProperties">&nbsp;
                            <b-badge variant="danger">CNT</b-badge>
                        </label>
                        &nbsp;&nbsp;
                        <label>
                            <input type="radio" value="cin" v-model="selectedResource" :disabled="disabledRadio == true" @click="resetProperties">&nbsp;
                            <b-badge variant="success">CIN</b-badge>
                        </label>
                        &nbsp;&nbsp;
                        <label>
                            <input type="radio" value="sub" v-model="selectedResource" :disabled="disabledRadio == true" @click="resetProperties">&nbsp;
                            <b-badge variant="secondary">SUB</b-badge>
                        </label>
                    <hr/>
                    <p>2. Fill out resource information</p>
                    <div v-if="selectedResource === 'cnt'" >
                        <b-container fluid>
                            <b-row>
                                <b-col sm="3">
                                    <label style="color:gray">Resource Name (rn)</label>
                                </b-col>
                                <b-col sm="9">
                                    <b-form-input v-model="rn" id="rn" :type="text"></b-form-input>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
                    <div v-if="selectedResource === 'cin'">
                        <b-container fluid>
                            <b-row>
                                <b-col sm="3">
                                    <label style="color:gray">Content (con)</label>
                                </b-col>
                                <b-col sm="9">
                                    <b-form-input v-model="con" id="con" :type="text"></b-form-input>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
                    <div v-if="selectedResource === 'sub'">
                        <b-container fluid>
                            <b-row>
                                <b-col sm="3">
                                    <label style="color:gray">Resource Name (rn)</label>
                                </b-col>
                                <b-col sm="9">
                                    <b-form-input v-model="rn" id="rn" :type="text"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="3">
                                    <label style="color:gray">Event Noti. Uri (nu)</label>
                                </b-col>
                                <b-col sm="9">
                                    <b-form-input  v-model="nu_str" id="nu" :type="text"></b-form-input>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="3">
                                    <label style="color:gray">Event Noti. Criteria (enc)</label>
                                </b-col>
                                <b-col sm="9">
                                    <b-form-group
                                        v-slot="{ ariaDescribedby }"
                                    >
                                        <b-form-checkbox-group
                                            v-model="net"
                                            :options="subOptions"
                                            :aria-dscribedby="ariaDescribedby"
                                            name="net"
                                            stacked
                                        >
                                        </b-form-checkbox-group>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
                </div>
                <div id="btn">
                    <b-button variant="light" @click="close">Cancel</b-button>
                    <b-button variant="primary" @click="createResource">Create</b-button>
                </div>
            </div>
            <div class="delete" v-if="selectedContextMenu === 'd'">
                <div id="info">Delete the selected resource</div>
                <div id="content">
                    <p>When you click "Delete" button, the selected resource will be removed from server include it's descendant resources and this process is not recoverable. Confirm what you want to do!</p>
                    <p>
                        Are you sure you want to delete 
                        <span style="padding-left: 5px">
                            <span v-if="type === 5">
                                <b-badge variant="warning">CSE</b-badge>
                            </span>
                            <span v-if="type === 2">
                                <b-badge variant="info">AE</b-badge>
                            </span>
                            <span v-if="type === 3">
                                <b-badge variant="danger">CNT</b-badge>
                            </span>
                            <span v-if="type === 4">
                                <b-badge variant="success">CIN</b-badge>
                            </span>
                            <span v-if="type == 23">
                                <b-badge variant="secondary">SUB</b-badge>
                            </span>
                            <span style="font-weight: bold">
                                {{resourceName}}  
                            </span>
                        </span>
                        ?
                    </p>
                </div>
                <div id="btn">
                    <b-button variant="light" @click="close">Cancel</b-button>
                    <b-button variant="primary" @click="deleteResource">Delete</b-button>
                </div>
            </div>
            <div class="properties" v-if="selectedContextMenu === 'p'">
                <div id="info">Resource Information</div>
                <div id="name">
                    <span v-if="type === 5">
                        <b-badge variant="warning">CSE</b-badge>
                    </span>
                    <span v-if="type === 2">
                        <b-badge variant="info">AE</b-badge>
                    </span>
                    <span v-if="type === 3">
                        <b-badge variant="danger">CNT</b-badge>
                    </span>
                    <span v-if="type === 4">
                        <b-badge variant="success">CIN</b-badge>
                    </span>
                    <span v-if="type == 23">
                        <b-badge variant="secondary">SUB</b-badge>
                    </span>
                    <span id="name">
                        {{resourceName}}  
                    </span>
                </div>
                <table v-for="item in properties">
                    <thead>
                        <tr bgcolor="#E5EEFA" align="center" style="color:blue">
                            <th>Attribute</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(value, name) in item">
                            <td>{{name}}</td>
                            <td>{{value}}</td>
                        </tr>
                    </tbody> 
                </table>
                <div id="btn">
                    <b-button variant="light" @click="close">Close</b-button>
                </div>
            </div>
        </aside>
        <vue-simple-context-menu
            :elementId="'contextMenu'"
            :options="optionsArray"
            :ref="'vueSimpleContextMenu'"
            @option-clicked="clickContextMenuOption"
        >
        </vue-simple-context-menu>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            url1: '',
            url2: '',
            latest: '10',
            options: [
                { text: '1 Latest', value: '1' },
                { text: '3 Latest', value: '3' },
                { text: '5 Latest', value: '5' },
                { text: 'ALL (up to 10)', value: '10'}
            ],
            list: [],           // 서버로부터 받은 데이터 List
            treeList: [],       // tree 구조 List

            properties: {},     // Properties 
            type: 0,            // Resource의 ty
            resourceName: '',   // Resource의 rn
            path: '',           // 경로

            optionsArray: [     // contextMenu
                {
                    name: 'Create',
                    disabled: false
                },
                {
                    type: 'divider'
                },
                {
                    name: 'Delete',
                    disabled: false
                },                
                {
                    type: 'divider'
                },
                {
                    name: 'Properties',
                    disabled: false
                }

            ],
            
            selectedContextMenu: '',    // 선택한 contextMenu

            selectedResource: null, // Radio Button으로 선택한 Create할 리소스
            disabledRadio: false,   // Radio Button 변경 시 
            
            rn: '',
            con: '',
            nu_str: '',
            nu: [],
            net: [],
            subOptions: [
                { text: 'Update of Resource(1)', value: 1 },
                { text: 'Delete of Resource(2)', value: 2 },
                { text: 'Create of Direct Child Resource(3)', value: 3 },
                { text: 'Delete of Direct Child Resource(4)', value: 4 },
            ],

            new_rn: null,   // create 시 생성된 리소스의 rn
            // Mock Server에서 확인
            //new_rn: "ae1_cnt2_sub",
        }
    },
    methods: {
        // Click submit button
        async getResource() {
            var url = this.url1 + '/viewer' + this.url2; + '?la=' + this.latest;
            //Mock Server
            //var url = 'https://4aded162-929f-41b2-904c-fe542272d2d7.mock.pstmn.io/TinyIoT'
            
            await axios.get(url
            ).then(response => {
                this.list = response.data;
                console.log(this.list);
            }).catch(error => {
                console.log(error);
                if(error.response) {
                    this.$swal.fire({
                        title: '대상 서버에 접속할 수 없습니다',
                        text: 'Unable to access destination server',
                        icon: 'error'
                    })
                }
            });

            this.treeList = this.list_to_tree(this.list);   // 기존 리스트 -> 트리 구조로 변환
            console.log("treeList:");
            console.log(this.treeList);
        },

        // Convert list to tree structure
        list_to_tree(list) {
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

        // Click reset button
        async resetAll() { // 마지막에 모두 마치고 관련 변수 다 넣어서 초기화 예정
            this.url1 = '';
            this.url2 = '';
            this.latest = '10';
            this.treeList = [];
            this.properties = {};
            this.selectedContextMenu = '';
            this.selectedResource = '';
            this.disabled = false;
        },

        // Handle right-click contextMenu
        handleRightClick (event, item) {
            this.$refs.vueSimpleContextMenu.showMenu(event, item);  // showMenu - vue-simple-context-menu.Vue
        },

        // Handle events based on contextMenu options
        async clickContextMenuOption (event) {
            // ContentMenu - Create 클릭
            if (event.option.name === 'Create') {
                this.selectedContextMenu = 'c';
                this.type = event.item.ty;
                if (this.type === 2) {  // AE에서 Create 시 CNT 외 radio 버튼 비활성화
                    this.disabledRadio = true;
                }
                this.resourceName = event.item.rn;
                // console.log(this.disabledRadio);
                this.getProperties(this.type, this.resourceName);
            }
            // ContentMenu - Delete 클릭
            else if (event.option.name === 'Delete') {
                this.selectedContextMenu = 'd';
                this.type = event.item.ty;
                this.resourceName = event.item.rn;
                this.getProperties(this.type, this.resourceName);
            }
            // ContextMenu - Properties 클릭
            else if(event.option.name === 'Properties') {
                this.selectedContextMenu = 'p';
                this.type = event.item.ty;
                this.resourceName = event.item.rn;
                this.getProperties(this.type, this.resourceName);
            }
        },

        // Change radio button on Create
        resetProperties() {
            this.rn = '';
            this.con = '';
            this.nu_str = '';
            this.nu = [];
            this.net = [];
        },

        // Click the Create button
        async createResource() {
            var url = this.url1 + this.path;
            console.log(url);

            if(this.selectedResource == 'cnt') {
                console.log('selectedResource: ' + this.selectedResource);
                var data = {
                    "m2m:cnt" : {
                        "rn" : this.rn
                    }
                }

                const jsonData = JSON.stringify(data)
                console.log(jsonData);

                await axios.post(url, jsonData, { headers : {'Content-Type' : 'application/json; ty=3'} })
                .then((response) => {    
                    console.log("응답 데이터");
                    console.log(response.data["m2m:cnt"].rn);
                    this.new_rn = response.data["m2m:cnt"].rn;
                    console.log(this.new_rn);
                })
            }
            else if(this.selectedResource == 'cin') {
                console.log('selectedResource: ' + this.selectedResource);
                console.log('con: ' + this.con);

                var data = {
                    "m2m:cin" : {
                        "con" : this.con
                    }
                }

                const jsonData = JSON.stringify(data)
                console.log(jsonData);

                await axios.post(url, jsonData, { headers : {'Content-Type' : 'application/json; ty=4'} })
                .then((response) => {
                    console.log("응답 데이터");
                    console.log(response.data["m2m:cin"].rn);
                    this.new_rn = response.data["m2m:cin"].rn;
                    console.log(this.new_rn);
                })
            }
            else if(this.selectedResource == 'sub') {
                console.log('selectedResource: ' + this.selectedResource);
                console.log('nu: ' + this.nu_str);
                console.log('net: ' + this.net);

                console.log(this.nu_str.indexOf(','))
                if(this.nu_str.indexOf(',') == -1)
                    this.nu.push(this.nu_str);
                else
                    this.nu = this.nu_str.split(',');
                console.log(this.nu);

                var data = {
                    "m2m:sub" :  {
                        "rn" : this.rn,
                        "enc" : {
                            "net": this.net
                        },
                        "nu" : this.nu
                    }
                }

                const jsonData = JSON.stringify(data)
                console.log(jsonData);

                await axios.post(url, jsonData, { headers : {'Content-Type' : 'application/json; ty=23'} })
                .then((response) => {
                    console.log("응답 데이터");
                    console.log(response.data["m2m:sub"].rn)
                    this.new_rn = response.data["m2m:sub"].rn;
                    console.log(this.new_rn);
                })
            }
            
            // this.getResource();  // 트리 부분 재조회로 변경

            this.close();   // 데이터 초기화
        },

        // Click the Delete button
        async deleteResource() {
            var url = this.url1 + this.path;
            console.log(url);

            await axios.delete(url)
            .then(res => {
                this.$swal.fire({   // Success Alert
                    title: 'Deleted!',
                    text: 'The resource has been deleted.',
                    icon: 'success'
                })

                // this.getResource();  // 트리 부분 재조회로 변경
                this.close();
            })
            .catch(err => {
                this.$swal.fire({   // Error Alert
                    title: 'Error!',
                    text: 'The resource  has not deleted.',
                    icon: 'error'
                })
                console.log(err);
            });

            // 기존 트리 뷰어에서 reload 대신 해당 리소스가 삭제됨
            // this.getResource();
        },

        // Click the Properties button
        async getProperties (type, resourceName) {
            this.path = this.findPath(this.list, resourceName);
            var url = this.url1 + this.path;

            // Mock Server
            // await axios.get('https://911d7654-821e-4958-b6f2-6f45f66399e2.mock.pstmn.io/TinyIoT'
            // ).then(response => {
            //     console.log(response);
            //     this.type = type;
            //     this.resourceName = resourceName;
            //     this.properties = response.data;
            // }).catch(error => {
            //     console.log(error);
            // })
            
            // TinyIoT
            await axios.get(url
            ).then(response => {
                console.log(response);
                this.type = type;
                this.resourceName = resourceName;
                this.properties = response.data;
            }).catch(error => {
                console.log(error);
            })
        },

        // Find the path of resourceName
        findPath(list, resourceName) {
            var result = list.find(item => item.rn === resourceName);
            var pi = result.pi;
            var path = '/' + result.rn;

            while(pi !== "NULL") {
                result = list.find(item => item.ri === pi);
                pi = result.pi;
                path = '/' + result.rn + path;
                console.log(path);
            }

            return path;
        },

        // Close the contextMenu options
        async close() {
            this.selectedContextMenu = '';
            this.selectedResource = '';
            this.disabledRadio = false;
            resetProperties();
            console.log(this.selectedContextMenu);
            console.log(this.selectedResource);
            console.log(this.disabledRadio);
            console.log(this.rn);
        },
    },
}
</script>

<style>
.wrapper {
    margin: 0;
    width: 100%;
    height: 100vh;
}
#url {
    padding-top: 20px;
    padding-left: 10px;
}
#radio {
    padding-top: 10px;
    padding-left: 25px;
}
.btn {
    margin-right: 10px;
}

section {
    position: relative;
    overflow: hidden;
    width: 65%;
    height: 100%;
    float: left;
    /* background-color: olive; */
}
hr {
    margin-top: 0!important;
    margin-bottom: 5px!important;
}
aside {
    position: relative;
    overflow: hidden;
    width: 35%;
    height: 100%;
    float: left;
    padding: 10px;
    border-left: 0.5px solid lightgray;
    /* background-color: violet; */
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

@keyframes blink-effect {
    50% {
        opacity: 0;
    }
}

.blink {
    animation-name: blink-effect;
    animation-duration: 1s;
    animation-iteration-count: 10;
    animation-timing-function: step-end;
    font-weight: bold;  /* 깜빡이는 동안 글자 크게 */
}

#info {
    padding: 10px;
    color: white;
    background-color: #17a2b7;
}
#name {
    margin-left: 5px;
    padding: 5px;
    margin-bottom: 5px;
    font-weight: bold; 
}
#content {
    margin-left: 5px;
    padding: 5px;
    margin-bottom: 5px;
}
#btn {
    padding-top: 10px;
    float: right;
}

table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid lightgray;
    border-radius: 5px !important;
}
th, td {
    border: 1px solid lightgray;
    padding: 7px;
}

</style>