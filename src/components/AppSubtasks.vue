<template>
    <div class="mb-3 subtasksContainer">
        <div class="pl-3">
            <v-checkbox
                class="pa-0 mt-5 singleTask"
                hide-details
                v-for="(subtask, index) in subtasksMainPart"
                :key="index"
                :input-value="subtask.checked"
                :label="subtask.name"
                @click="checkboxValueChange(index)"
            ></v-checkbox>
        </div>
        <div ref="showHideContainer" class="pb-3 pl-3 showHideContainer">
            <v-checkbox
                class="pa-0 mt-5 singleTask"
                hide-details
                v-for="(subtask, index) in subtasksHidePart"
                :key="index"
                :input-value="subtask.checked"
                :label="subtask.name"
                @click="checkboxValueChange(maxElemsToShow + index)"
            ></v-checkbox>
        </div>
        <div class="pl-3">
            <v-btn
                v-if="showBtn"
                @click="showAndHide"
                class="showMoreLessBtn"
                color="primary"
                elevation="4"
                small
                outlined
                >{{ btnText }}</v-btn
            >
        </div>
    </div>
</template>

<script>
export default {
    name: "AppSubtasks",
    props: {
        subtasks: {
            type: Array,
            default() {
                return []
            },
        },
    },
    data() {
        return {
            maxElemsToShow: 4,
            showAll: false,
        }
    },
    computed: {
        subtasksLength() {
            return this.subtasks.length
        },
        subtasksMainPart() {
            return this.subtasks.slice(0, this.maxElemsToShow)
        },
        subtasksHidePart() {
            return this.subtasks.slice(this.maxElemsToShow)
        },
        showBtn() {
            return this.subtasksHidePart.length > 0
        },
        btnText() {
            return this.showAll === true ? "Свернуть" : "Развернуть"
        },
    },
    methods: {
        checkboxValueChange(index) {
            this.$emit("checkbox-value-change", index)
        },
        setHeight() {
            this.$refs["showHideContainer"].style.maxHeight =
                this.showAll === true
                    ? `${this.$refs["showHideContainer"].scrollHeight}px`
                    : 0
        },
        showAndHide() {
            this.showAll = !this.showAll
            this.setHeight()
        },
    },
    watch: {
        showBtn() {
            this.showAll = false
        },
        subtasksLength() {
            this.setHeight()
        },
    },
}
</script>

<style lang="scss" scoped>
.singleTask {
    width: max-content;
}

.showHideContainer {
    overflow: hidden;
    transition: max-height 0.6s ease-out;
    max-height: 0;
}

.showMoreLessBtn {
    min-width: 25% !important;
}
</style>
