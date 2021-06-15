<template>
    <div class="vUsers">
        <p>{{users.username}}</p>
    </div>
</template>

<script>
export default {
    name:'vUsers',
    data(){

    },
    props:{
        users:{
            typeof:Object,
            default(){
                return {};
            }
        }
    },


    methods:{

    },

    watch:{

    },

    mounted() {

    }
}
</script>