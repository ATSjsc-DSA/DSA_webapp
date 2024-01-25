<template>
  <div
    :id="idUuid"
    :class="'dashboard__block dashboard__block--' + type + ' dashboard__block--' + state"
    :style="{ flexBasis: flexBasis }"
    ref="block"
    @drop="handleReplaceDrop"
  >
    <component
      v-if="type === 'panel'"
      :is="realComponent"
      ref="refRealComponent"
      v-bind="meta"
      @handleReadyPrintRealComponent="handleReadyPrintRealComponent"
      @handleUpdateDataRealComponent="handleUpdateDataRealComponent"
      class="dashboard__block__component"
      :editing="editing"
      :pdfMode="pdfMode"
    ></component>
    <DSA_DashboardBlock
      v-else-if="children.length"
      v-for="(child, i) in children"
      v-bind="child"
      :component-getter="componentGetter"
      :key="childKey(child)"
      :i="i"
      :editing="editing"
      :pdfMode="pdfMode"
      @change="$emit('change')"
      @changing="$emit('changing')"
      @handleReadyPrintDashboardBlock="handleReadyPrintDashboardBlock"
    ></DSA_DashboardBlock>
    <component
      v-else
      :is="emptyDashboard"
      class="dashboard__block__component dashboard__block__component--empty"
    ></component>
    <div
      class="controls"
      v-show="editing && type === 'panel'"
      @dragstart="handleDragstart"
      draggable="true"
      ref="draggable"
    >
      <div class="controls__control controls__control--hover controls__control--delete" @click="handleDelete">
        <i class="pi pi-fw pi-times"></i>
      </div>
      <div class="controls__control controls__control--hover controls__control--setting" @click="handleSettingClick">
        <i class="pi pi-fw pi-cog"></i>
      </div>

      <div
        class="controls__control controls__control--drop controls__control--left"
        role="button"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @drop="handleAddDrop"
      >
        +
      </div>
      <div
        class="controls__control controls__control--drop controls__control--top"
        role="button"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @drop="handleAddDrop"
      >
        +
      </div>
      <div
        class="controls__control controls__control--drop controls__control--right"
        role="button"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @drop="handleAddDrop"
      >
        +
      </div>
      <div
        class="controls__control controls__control--drop controls__control--bottom"
        role="button"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @drop="handleAddDrop"
      >
        +
      </div>
    </div>

    <div v-if="editing" class="drag-control" @mousedown="handleMouseDown"></div>
  </div>
</template>

<script type="text/babel">
import { v4 as uuidv4 } from 'uuid';
import { getCurrentInstance } from 'vue';
const minimumSizes = {
  height: 100,
  width: 100,
};

const keyLookup = new WeakMap();

export default {
  name: 'DSA_DashboardBlock',
  props: {
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 1,
    },
    meta: {
      type: Object,
    },
    // @todo: Validate for either component or children, not both
    component: {
      type: String,
    },
    children: {
      type: Array,
    },
    i: {
      type: Number,
    },
    componentGetter: {
      type: Function,
      required: true,
    },
    editing: {
      type: Boolean,
      required: true,
    },
    pdfMode: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    state: 'default',
    idUuid: uuidv4(),
    readyPrint: false,
    readyPrintArray: [],
  }),
  methods: {
    handleAddDrop(e) {
      e.target.classList.remove('controls__control--active');

      const data = e.dataTransfer.getData('text');
      if (!data) {
        return;
      }

      const direction = e.target.className.replace(/.*controls__control--(\S+).*/, '$1');
      const directionMatch = {
        left: 'horizontal',
        right: 'horizontal',
        top: 'vertical',
        bottom: 'vertical',
      };

      const parentType = this.$parent.type;
      const newComponent = JSON.parse(data);

      if (parentType === directionMatch[direction]) {
        const isHorizontal = this.$parent.type === 'horizontal';
        const parentRect = this.$parent.$refs.block.getBoundingClientRect();
        const parentSize = isHorizontal ? parentRect.width : parentRect.height;
        const minSize = minimumSizes[isHorizontal ? 'width' : 'height'];
        const minPercent = minSize / parentSize;

        /* eslint-disable no-mixed-operators */

        const n = this.$parent.children.length;
        const newChildSize = 1 / (n + 1);

        const beforeAllExcess = 1 - n * minPercent;
        const afterAllExcess = 1 - (n + 1) * minPercent;

        if (afterAllExcess < 0) {
          // @todo something more informative here: there's no space
          //return;
        }

        const sizeAdjustFactor = (afterAllExcess - (newChildSize - minPercent)) / beforeAllExcess;

        this.$parent.children.forEach((child) => {
          /* eslint-disable no-param-reassign */
          child.size = (child.size - minPercent) * sizeAdjustFactor + minPercent;
        });

        const spliceI = this.i + (direction === 'right' || direction === 'bottom' ? 1 : 0);

        this.$parent.children.splice(
          spliceI,
          0,
          Object.assign(newComponent, {
            type: 'panel',
            size: newChildSize,
          }),
        );
      } else {
        const newSelf = {
          type: 'panel',
          size: 0.5,
          component: this.component,
          meta: this.meta,
        };
        const newSibling = Object.assign(newComponent, {
          type: 'panel',
          size: 0.5,
        });

        const children =
          direction === 'right' || direction === 'bottom' ? [newSelf, newSibling] : [newSibling, newSelf];

        this.$parent.children.splice(this.i, 1, {
          type: directionMatch[direction],
          size: this.size,
          children,
        });
      }

      this.$emit('change');
    },
    handleReplaceDrop(e) {
      if (!this.editing) {
        return;
      }

      e.target.classList.remove('controls__control--active');

      const data = e.dataTransfer.getData('text');

      // Event has propagated, ignore
      if (this.type !== 'panel' && this.children.length) {
        return;
      }

      // This is an add that has propagated, not a replace
      if (e.target.classList.contains('controls__control')) {
        return;
      }

      if (!data) {
        return;
      }

      const newComponent = JSON.parse(data);

      if (this.type === 'panel') {
        Object.assign(this.$parent.children[this.i], newComponent);
      } else {
        // This is a specific case just for empty dashboards
        this.children.push(
          Object.assign(newComponent, {
            type: 'panel',
            size: 1,
          }),
        );
      }

      this.$emit('change');
    },
    handleDragenter(e) {
      e.target.classList.add('controls__control--active');
    },
    handleDragleave(e) {
      e.target.classList.remove('controls__control--active');
    },
    handleDelete() {
      if (this.$parent.children.length === 1) {
        this.$parent.children.splice(0, 1);
        const parentParent = this.$parent.$parent;
        if (parentParent.children) {
          parentParent.children.splice(this.$parent.i, 1);
        }
      } else if (this.$parent.children.length === 2) {
        const parentParent = this.$parent.$parent;

        if (!parentParent) return;

        if (parentParent.children) {
          const parentSiblingsPanels = parentParent.children.every(
            (block, i) => i === this.$parent.i || block.type === 'panel',
          );
          if (parentSiblingsPanels) {
            const sibling = this.$parent.children[1 - this.i];

            if (sibling.type === 'panel') {
              sibling.size = this.$parent.size;
              this.$parent.$parent.children.splice(this.$parent.i, 1, sibling);
            } else {
              sibling.children.forEach((child) => {
                // eslint-disable-next-line no-param-reassign
                child.size *= this.$parent.size;
              });

              this.$parent.$parent.children.splice(this.$parent.i, 1, ...sibling.children);
            }
          } else {
            const parentObject = parentParent.children[this.$parent.i];
            const sibling = parentObject.children[1 - this.i];
            sibling.size = parentObject.size;

            parentParent.children[this.$parent.i] = sibling;
          }
        } else {
          this.$parent.children.splice(this.i, 1);

          this.$parent.children.forEach((child) => {
            // eslint-disable-next-line no-param-reassign
            child.size /= 1 - this.size;
          });

          // // We're setting the sibling directly on the root element
          // const rootData = this.$parent.$parent.data;
          // console.log('delete size =2 parentParent no children');
          // console.log(this.$parent.$parent);
          // const sibling = this.$parent.children[1 - this.i];
          // sibling.size = 1;

          // console.log('delete size =2 rootData');
          // console.log(this.$parent.$parent);
          // console.log('delete size =2 sibling');
          // console.log(sibling);

          // if (sibling.type === 'panel') {
          //   rootData.children = [sibling];
          // } else {
          //   Object.assign(rootData, sibling);
          // }
        }
      } else {
        this.$parent.children.splice(this.i, 1);

        this.$parent.children.forEach((child) => {
          // eslint-disable-next-line no-param-reassign
          child.size /= 1 - this.size;
        });
      }

      this.$emit('change');
    },
    handleSettingClick() {
      this.$refs.refRealComponent.ShowSetting();
    },
    handleUpdateDataRealComponent(data) {
      console.log('update');

      const thisComponent = this.$parent.children[this.i];
      if (thisComponent) {
        if (!thisComponent.meta) {
          thisComponent.meta = {};
        }
        thisComponent.meta.externalData = data;
      }

      this.$emit('change');
    },
    handleReadyPrintRealComponent(_Id, _readyPrint) {
      console.log('handle ready : ' + _Id + '  - ' + _readyPrint);
      this.readyPrint = _readyPrint;
      //this.$emit('handleReadyPrintDashboardBlock', this.idUuid, _readyPrint);
    },
    handleReadyPrintDashboardBlock(_Id, _readyPrint) {
      //	console.log('handle ready 2 : ' + _Id + '  - ' + _readyPrint);
      this.readyPrint = this.checkChildrenArrayReadyPrint(_Id, _readyPrint);
      if (this.readyPrint && this.readyPrintArray.length == this.children.length) {
        // this.$emit('handleReadyPrintDashboardBlock', this.idUuid, true);
      }
    },

    checkChildrenArrayReadyPrint(_Id, _readyPrint) {
      let containKey = false;
      let checkReady = _readyPrint;

      this.readyPrintArray.forEach((element) => {
        if (element.id == _Id) {
          containKey = true;
          element.readyPrint = _readyPrint;
        }

        if (element.readyPrint == false) {
          checkReady = false;
        }
      });
      if (!containKey) this.readyPrintArray.push({ id: _Id, readyPrint: _readyPrint });
      return checkReady;
    },

    handleMouseDown(e) {
      const isHorizontal = this.$parent.type === 'horizontal';
      const start = isHorizontal ? e.pageX : e.pageY;

      const parentRect = this.$parent.$refs.block.getBoundingClientRect();
      const parentSize = isHorizontal ? parentRect.width : parentRect.height;

      const previous = this.$parent.children[this.i - 1];
      const previousStartSize = previous.size;
      console.log('-------------------------xxxxxx--------------------');
      console.log(previous);
      const currentStartSize = this.size;
      const mousemoveHandler = (e2) => {
        e2.preventDefault();

        const offset = (isHorizontal ? e2.pageX : e2.pageY) - start;
        const offsetAsPercentage = offset / parentSize;

        const minPerc = minimumSizes[isHorizontal ? 'width' : 'height'] / parentSize;

        console.log(
          'o: ' + offsetAsPercentage + ' p: ' + previousStartSize + ' s:' + currentStartSize + ' m: ' + minPerc,
        );

        if (offsetAsPercentage > 0) {
          if (currentStartSize - offsetAsPercentage <= minPerc) {
            console.log('handleMouseDown 1');
            return;
          }
        } else if (previousStartSize + offsetAsPercentage <= minPerc) {
          console.log('handleMouseDown 2');
          return;
        }
        previous.size = previousStartSize + offsetAsPercentage;
        this.$parent.children[this.i].size = currentStartSize - offsetAsPercentage;

        this.$emit('changing');
      };

      const mouseupHandler = () => {
        document.removeEventListener('mousemove', mousemoveHandler);
        document.removeEventListener('mouseup', mouseupHandler);

        this.$emit('change');
      };

      document.addEventListener('mousemove', mousemoveHandler);
      document.addEventListener('mouseup', mouseupHandler);
    },
    handleDragstart(e) {
      if (this.type !== 'panel') {
        return;
      }

      const thisComponent = this.$parent.children[this.i];
      const data = {
        component: thisComponent.component,
        meta: thisComponent.meta,
      };

      e.dataTransfer.setData('text', JSON.stringify(data));

      this.state = 'dragging';

      const dropHandler = (ei) => {
        document.removeEventListener('drop', dropHandler);

        if (ei.target !== this.$refs.draggable) {
          console.log('out6');
          if (ei.target.classList.contains('controls__control--drop')) {
            this.handleDelete();
          } else {
            this.state = 'default';
          }
        } else {
          this.state = 'default';
          console.log('out7');
        }
      };

      document.addEventListener('drop', dropHandler);
    },
    childKey(child) {
      let key = keyLookup.get(child);

      if (!key) {
        key = Math.random();
        keyLookup.set(child, key);
      }

      return key;
    },
  },
  computed: {
    flexBasis() {
      const percentage = `${this.size * 100}%`;
      return this.type === 'panel' ? `calc(${percentage} - 10px)` : percentage;
    },
    realComponent() {
      return this.componentGetter(this.component, this.meta);
    },
    emptyDashboard() {
      return this.componentGetter('empty-dashboard');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$twentyFivePercent: 100%;
.dashboard__block {
  flex: 1 1 auto;

  position: relative;

  display: flex;

  &--panel {
    //margin: 5px;
  }

  &--horizontal,
  &--vertical {
    display: flex;
  }

  &--vertical {
    flex-direction: column;
  }

  &__component {
    flex: 1 1 auto;
  }

  &--dragging {
    filter: grayscale(10%);
    opacity: 0.4;

    .dashboard--dragging & .controls__control {
      display: none !important;
    }
  }

  .controls {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    .dashboard--editing & {
      cursor: move;
    }

    &__control {
      position: absolute;
      display: none;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 1rem;
      line-height: 15px;

      background-color: rgba(black, 0.1);
      color: rgba(white, 0.3);
      cursor: pointer;

      &--active,
      &:hover {
        background-color: rgba(rgb(50, 100, 25), 1);
        color: rgba(white, 0.7);
      }

      .dashboard--dragging &--drop {
        display: flex;
      }

      &--left,
      &--right {
        width: 25px;
        height: 100%;
      }

      &--right {
        right: 0;
      }

      &--top,
      &--bottom {
        width: calc(100% - 60px);
        height: 15px;
        left: 30px;
      }

      &--bottom {
        bottom: 0;
      }

      &--delete {
        top: 0;
        left: 0;
        width: 20px;
        height: 15px;
        &:hover {
          background-color: rgba(rgb(128, 0, 0), 1);
          color: rgba(white, 0.7);
        }
      }
      &--setting {
        top: 0;
        left: 20px;
        width: 20px;
        height: 15px;
        &:hover {
          background-color: rgba(rgb(0, 115, 187), 1);
          color: rgba(white, 0.7);
        }
      }
    }
  }

  &:not(:first-child) {
    > .drag-control {
      position: absolute;

      // Display on left
      .dashboard__block--horizontal > & {
        left: -5px;
        top: 0;

        width: 10px;
        height: 100%;

        cursor: ew-resize;
      }

      // Display on top
      .dashboard__block--vertical > & {
        top: -5px;
        left: 0;

        width: 100%;
        height: 10px;

        cursor: ns-resize;
      }
    }

    &.dashboard__block--panel > .drag-control {
      .dashboard__block--horizontal > & {
        left: -10px;
      }

      .dashboard__block--vertical > & {
        top: -10px;
      }
    }
  }
}
</style>

<!-- https://www.primefaces.org/roma/icons.xhtml -->
<style>
.dashboard:not(.dashboard--dragging) .dashboard__block--panel:hover .controls__control--hover {
  display: flex;
}
</style>
