<template xmlns:el-col="http://www.w3.org/1999/html">
    <div id="app">
        <el-container>
            <el-header height="100">
                <h1 :style="titleColor">南科幼儿园 | WannaAC 代码测试平台</h1>
                <h5 class="author">{{welcome}}</h5>
                <!--                后端:Macromogic;前端:Whexy;服务器:Eveneko-->

            </el-header>
            <el-main>
                <el-row type="flex" align="middle">
                    <el-col :span="6">
                        <el-select v-model="ProblemWhat" placeholder="请选择题目" @change="ChangeProblem"
                                   :disabled="status==='pending'">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-radio-group v-model="language" fill="#909399" @change="ChangeLanguage"
                                        :disabled="status==='pending'">
                            <el-radio-button label="C++">C++</el-radio-button>
                            <el-radio-button label="Java">Java</el-radio-button>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <codemirror v-model="code" :options="cmOptions" class="code"></codemirror>
                <el-row class="code">
                    <el-button
                            @click="UploadCode" icon="el-icon-upload2" round
                            type="primary"
                            :loading="status==='pending'" :disabled="ProblemWhat===''||colding===true">
                        {{UPLoadCode_Text}}
                    </el-button>
                    <el-button
                            type="warning" icon="el-icon-folder-add" round @click="contribution=true"
                            :disabled="ProblemWhat===''">我要贡献数据
                    </el-button>
                    <el-button circle icon="el-icon-toilet-paper" @click="dialogVisible_USER=true"></el-button>
                    <el-button circle icon="el-icon-tickets" @click="outactive=!outactive"></el-button>
                </el-row>

                <el-divider v-if="outactive"></el-divider>
                <h3 v-if="outactive">数据反馈</h3>
                <el-row v-if="outactive" class="output" type="flex" align="middle">
                    <el-col>
                        <el-row type="flex" justify="start">
                            <el-tooltip class="item" effect="dark" content="点击可复制" placement="top">
                                <el-button type="text" round v-clipboard:copy="out.testData">输入数据</el-button>
                            </el-tooltip>
                        </el-row>
                        <el-input v-model="out.testData" readonly type="textarea"
                                  :autosize="{minRows:2, maxRows:8}"></el-input>
                    </el-col>
                    <el-col>
                        <el-row type="flex" justify="start">
                            <el-tooltip class="item" effect="dark" content="点击可复制" placement="top">
                                <el-button type="text" round v-clipboard:copy="out.expectedOutput">期待输出</el-button>
                            </el-tooltip>
                        </el-row>
                        <el-input v-model="out.expectedOutput" readonly type="textarea"
                                  :autosize="{minRows:2, maxRows:8}"></el-input>
                    </el-col>
                    <el-col>
                        <el-row type="flex" justify="start">
                            <el-tooltip class="item" effect="dark" content="点击可复制" placement="top">
                                <el-button type="text" round v-clipboard:copy="out.actualOutput">你的输出</el-button>
                            </el-tooltip>
                        </el-row>
                        <el-input v-model="out.actualOutput" readonly type="textarea"
                                  :autosize="{minRows:2, maxRows:8}"></el-input>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
        <el-dialog
                title="状态"
                :visible.sync="dialogVisible_Code"
                width="50%">
            <el-row>{{
                {"AC":"您成功通过了此题！",
                "WA":"答案错误！",
                "TLE":"运行超时！",
                "CE":"编译错误！",
                "RE":"运行时错误！",
                "UE":"未知错误！"}[status]
                }}
            </el-row>
            <el-row>
                <el-progress :text-inside="true" :stroke-width="22" :percentage="acratio"
                             :status="progressColor"></el-progress>
            </el-row>

            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible_Code = false">确 定</el-button>
             </span>
        </el-dialog>
        <el-dialog
                title="公 约"
                :visible.sync="dialogVisible_USER"
                :show-close="false"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                width="50%">
            <el-row style="text-align: left; line-height: normal">
                <b>WannaAC</b> 代码测试平台是南科幼儿园的公益项目，并感谢由 Eveneko 学长慷慨提供测试服务器。使用本平台，您需要了解以下内容：<br><br>
                1. 测试分为两部分，第一部分将测试重要数据。第二部分将测试随机数据。一旦您所递交的程序出现错误，测试将立刻终止。<br>
                2. 重要数据指多数人有可能出错的样例。当程序不通过某随机数据时，这条随机数据也将被加入重要数据组。您贡献的数据也将在测试后直接进入重要数据组。<br>
                3. <b>即使您通过了测试，也不代表您的程序真正正确。</b><br>
                4. 出于服务器性能考量，每次提交后有 10 秒的冷却时间。<br>
                5. 不得提交诸如重启机器、关闭进程等恶意代码。否则平台将无限期关闭。
                <br></el-row>

            <span slot="footer" class="dialog-footer">
            <el-button type="success" @click="dialogVisible_USER = false">同意</el-button>
                 <el-button type="danger" disabled>不同意</el-button>
             </span>
        </el-dialog>
        <el-dialog
                title="贡献数据"
                :visible.sync="contribution"
                width="60%">
            <el-row class="status">
                感谢您对 WannaAC 平台发展的贡献！在通过标准程序测试后，您提供的数据将加入重要数据组。
            </el-row>
            <el-row type="flex">
                <el-col>
                    <el-row>输入数据</el-row>
                    <el-row>
                        <el-input type="textarea" autosize v-model="testdata_in"></el-input>
                    </el-row>
                </el-col>
                <el-col>
                    <el-row>期待输出</el-row>
                    <el-row>
                        <el-input type="textarea" autosize v-model="testdata_out"></el-input>
                    </el-row>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                    <el-button type="warning" @click="submitData">提交</el-button>
             </span>
        </el-dialog>
    </div>
</template>


<script>
    import {codemirror} from "vue-codemirror";
    //导入使用的语言语法定义文件
    require("codemirror/mode/python/python.js");
    require("codemirror/mode/javascript/javascript.js");
    require("codemirror/mode/clike/clike.js");
    require("codemirror/mode/shell/shell.js");
    //导入选中的theme文件
    require("codemirror/theme/blackboard.css");
    //导入自动提示核心文件及样式
    require("codemirror/addon/hint/show-hint.css");
    require("codemirror/addon/hint/show-hint.js");
    //导入指定语言的提示文件
    require("codemirror/addon/hint/javascript-hint.js");

    export default {
        name: 'app',
        data: function () {
            return {
                options: [],
                ProblemWhat: '',
                code: '请先选择题目。',
                titleColor: {
                    "color": "#ba463d"
                },
                status: 'WA',
                UPLoadCode_Text: '上传待测代码',
                dialogVisible_Code: false,
                dialogVisible_USER: true,
                cmOptions: {
                    tabSize: 4,
                    // mode: "text/javascript", //识别的语言javascript
                    // mode: "text/x-java",  //识别的语言java
                    mode: "text/x-c++src",
                    // mode:"text/x-sh",   //识别的语言shell脚本
                    theme: "default",  //编辑器的主题
                    lineNumbers: true,   //显示行号
                    line: true
                },
                language: "C++",
                acratio: 32,
                progressColor: "success",
                welcome: '',
                out: {
                    'actualOutput': '',
                    'expectedOutput': '',
                    'testData': ''
                },
                outactive: false,
                contribution: false,
                testdata_in: '',
                testdata_out: '',
                colding: true
            }
        },
        components: {codemirror},
        mounted() {
            this.getProblem();
            this.getWelcome();
            this.cold();
        },
        methods: {
            cold() {
                this.colding = true;
                let remain = 10;
                let set = setInterval(
                    ()=>{
                        remain--;
                        this.UPLoadCode_Text = '上传冷却中('+remain+')';
                        if (remain===1){clearInterval(set)}
                    },1000
                );
                setTimeout(()=>{
                    this.UPLoadCode_Text = '上传待测代码';
                    this.colding = false;
                },10000);
            },

            getProblem() {
                this.axios.get("http://wa.whexy.com:5000/problemset/").then(
                    response => {
                        this.options = response.data;
                    }
                )
            },

            getWelcome() {
                this.axios.get("http://wa.whexy.com:5000/wc/").then(
                    response => {
                        this.welcome = response.data;
                    }
                )
            },

            RefreshStatus() {
                if (this.status === "AC") {
                    this.titleColor.color = "#64a257";
                    this.progressColor = "success";
                } else if (this.status === "WA") {
                    this.titleColor.color = "#ba463d";
                    this.progressColor = "exception";
                } else if (this.status === "pending") {
                    this.titleColor.color = "#54a9ce";
                } else {
                    this.titleColor.color = "#eb9329";
                    this.progressColor = "warning";
                }
            }
            ,
            UploadCode: function () {
                this.status = "pending";
                this.RefreshStatus();
                this.UPLoadCode_Text = "正在测试代码";
                let data = {
                    probInfo: this.ProblemWhat,
                    content: this.code,
                    language: this.language
                };
                this.axios.post("http://wa.whexy.com:5000/submit/", data).then(
                    response => {
                        this.status = response.data.runtimeStatus;
                        this.acratio = response.data.passedRatioPercent;
                        this.dialogVisible_Code = true;
                        if (this.status !== "AC" && this.status !== "CE" && this.status !== "UE") {
                            this.out.actualOutput = response.data.actualOutput;
                            this.out.testData = response.data.testData;
                            this.out.expectedOutput = response.data.expectedOutput;
                            this.outactive = true
                        } else if (this.status === "CE") {
                            this.out.actualOutput = response.data.compileInfo;
                            this.outactive = true;
                        }
                        this.RefreshStatus();
                        this.cold();
                    }
                )
            }
            ,
            ChangeProblem() {
                this.status = "WA";
                this.outactive = false;
                this.RefreshStatus();
                this.code = ""
            },

            ChangeLanguage() {
                this.status = "WA";
                this.outactive = false;
                this.RefreshStatus();
                this.cmOptions.mode = {
                    "C++": "text/x-c++src",
                    "Java": "text/x-java"
                }[this.language];
                this.code = ""
            },

            submitData() {
                let d = {
                    'in': this.testdata_in,
                    'out': this.testdata_out,
                    'probInfo': this.ProblemWhat
                };
                this.axios.post("http://ac.whexy.com:5000/submitdata/", d).then(
                    response => {
                        let s = response.data.testStatus;
                        if (s === "Accepted") {
                            this.$message({
                                message: '数据通过测试，已添加入重要数据组。',
                                type: 'success'
                            });
                            this.contribution = false;
                            this.testdata_out = '';
                            this.testdata_in = '';
                        } else {
                            this.$message.error('数据没有通过标准测试，请检查输入输出是否对应！');
                        }
                    }
                )
            }

        }
    }
</script>

<style>
    #app {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin: 0 auto;
        max-width: 960px;
    }

    body {
        background-color: rgb(238, 238, 238);
    }

    .el-header {
        text-align: -webkit-left;
        background-color: rgb(255, 255, 255);
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }

    .author {
        color: #606266;
    }

    .CodeMirror-line {
        text-align: left;
    }

    .code {
        margin-top: 20px;
    }

    .el-progress-bar {
        margin-top: 20px;
    }

    .status {
        font-size: 16px;
        line-height: 1.3;
        margin-bottom: 15px;
    }

    .output {
        margin-top: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
</style>
