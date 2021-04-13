<template>
    <div class="alert">
        <div class="alert_header">提示</div>
        <div class="alert_body">
            {{data.errorMsg}}
        </div>
        <div class="alert_footer">
            <button @click="handleCommit">确定</button>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        data:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    methods: {
        handleCommit(){
            if(this.data.loginFlag){
                let loginUrl = sessionStorage.getItem('loginUrl')
                location.href = loginUrl
            }else{
                this.$store.state.closeDialog()
            }
        }
    }
}
</script>
<style lang="scss" >
.alert{
    position: absolute;
    width: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 2px;
    background: #fff;

    & .alert_header{
        padding: 20px 20px 10px;
    }

    & .alert_body{
        padding: 30px 20px;
        color: #606266;
        font-size: 14px;
        word-break: break-all;
    }

    & .alert_footer{
        padding: 10px 20px 20px;
        text-align: right;
        box-sizing: border-box;

        & button{
            display: inline-block;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            background: #FFF;
            border: 1px solid #DCDFE6;
            color: #606266;
            -webkit-appearance: none;
            text-align: center;
            box-sizing: border-box;
            outline: 0;
            margin: 0;
            font-weight: 500;
            padding: 12px 20px;
            font-size: 14px;
            border-radius: 4px;
        }
    }
}
</style> 