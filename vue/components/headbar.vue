<template>
<div id="head">
    <header>
        <h2><slot>主页</slot></h2>
    </header>
</div>
</template>

<script>
export default {

}
</script>

<style lang="sass">
#head {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    color: white;
    z-index: 10;
    header {
        padding: 10px 0;
        background-color: #3f51b5;
        border-bottom: 1px solid #3f51b5;
        height: 40px;
    }
    h2 {
        margin: 0;        
        font-size: 16px;
    }
    text-align: center;
}
</style>