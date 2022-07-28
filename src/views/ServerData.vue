<template>
    <div id="wrap">
        <div id="target">
                <b-container fluid>
                <b-row class="my-1" v-for="type in types" :key="type">
                    <b-col sm="10">
                        <b-form-input :id="`type-${type}`" :type="type" placeholder="Target Resource"></b-form-input>
                    </b-col>
                    <b-col sm="2">
                        <b-button @click="getResource">Submit</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </div>
        <hr>
        <div id="display">
            <table>
                <tbody>
                    <tr :key="i" v-for="(resource, i) in resource">
                        <td v-if="resource.type === 5"><div :style="{'margin-left': '0px'}"><h4>{{  resource.rn }}</h4></div></td>
                        <td v-else-if="resource.type === 2"><div :style="{'margin-left': '60px'}"><h4>{{  resource.rn }}</h4></div></td>
                        <td v-else-if="resource.type === 3"><div :style="{'margin-left': '120px'}"><h4>{{  resource.rn }}</h4></div></td>
                        <td v-else-if="resource.type === 4"><div :style="{'margin-left': '180px'}"><h4>{{  resource.rn }}</h4></div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    components: {},
    data() {
        return {
            resource: [],
            types: [
                'url'
            ]
        };
    },
    setup() {},
    created() {},
    mounted() {},
    unmounted() {},
    methods: {
        async getResource() {
            this.resource = await this.api(
                "https://d6c4aa4e-042b-44af-be2a-6359bad9eece.mock.pstmn.io/resource",
                "get",
                {}
            );
            console.log(this.resource);
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
    },
};
</script>

<style>
#wrap {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  width: 100%;
  position: relative;
}
#target {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 10px;
  width: 100%;
  position: relative;
}
#display {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 30px;
  color: #2c3e50;
  width: 100%;
  position: relative;
  font-size: 18px;
}
</style>