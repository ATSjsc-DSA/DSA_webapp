<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, watch } from 'vue';
import * as go from './gojs/release/go';
import './gojs/extensions/Figures';
import PortShiftingTool from './PortShiftingTool';
import { AvoidsLinksRouter } from './AvoidsLinksRouter';
import * as api from './api';
const { isDarkTheme } = useLayout();

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const props = defineProps({
  chartData: {
    type: Object,
    require: true,
  },
  parentWidth: {
    type: Number,
    default: 200,
  },
});

const emits = defineEmits(['refeshData']);
const DataProps = computed(() => props.chartData);
const chartData = ref();
const modificationTime = ref();

var myDiagram = ref(null);

var red = 'orangered'; // 0 or false
var green = 'forestgreen'; // 1 or true
var station_definitions = [];
var networkData = {
  class: 'GraphLinksModel',
  linkFromPortIdProperty: 'fromPort',
  linkToPortIdProperty: 'toPort',
  nodeDataArray: [],
  linkDataArray: [],
};
const getDefinitionListInStation = async (station_psd_id) => {
  try {
    const res = await api.DefinitionListApi.getDefinitionListInStation(
      '66decf1dcff005199529524b',
      '66ffc314bf646e4519eb1516',
    );
    station_definitions = res.data;
    console.log(station_definitions);
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};
const getPsDataWithDefinition = async (definitionId) => {
  try {
    const res = await api.PowerSystemParameterApi.getPsDataWithDefinition(
      definitionId,
      '66decf1dcff005199529524b',
      '66ffc314bf646e4519eb1516',
    );
    console.log(res.data);
    return res;
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

const getNodeDataWithDefinition = async () => {
  try {
    const res = await api.PowerSystemParameterApi.getNodeDataWithDefinition(
      '66decf1dcff005199529524b',
      '66ffc314bf646e4519eb1516',
    );
    console.log(res.data);
    return res;
  } catch (error) {
    console.log('getDefinitionList: error ', error);
    toast.add({ severity: 'error', summary: 'Definition List', detail: error.data.detail, life: 3000 });
  }
};

const makeNodeArrayAndLinkArray = (category, data) => {
  console.log(category);
  console.log(data);
  for (const para of data.param) {
    networkData.nodeDataArray.push({ category: category, name: para.name, key: para._id });
  }
  for (const ems of data.ems) {
    // Lặp qua tất cả các phần tử trong ems.data
    var in_sunfix = 1;
    for (const dataItem of ems.data) {
      networkData.linkDataArray.push({
        from: ems._id,
        to: dataItem, // Tạo link tới từng phần tử trong ems.data
        fromPort: 'in' + in_sunfix,
        toPort: 'in1',
      });
      in_sunfix = in_sunfix + 1;
    }
  }
};

const makeNodeNodeArrayAndLinkArray = (category, data) => {
  console.log(category);
  console.log(data);
  for (const para of data) {
    networkData.nodeDataArray.push({ category: category, name: para.name, key: para._id });
  }
};

const getEquipmentInStation = async () => {
  for (const item of station_definitions) {
    let definitionId = item._id;
    let res = await getPsDataWithDefinition(definitionId);
    let data = res.data;
    if (!data) return;
    if (item.name == 'Generator') {
      makeNodeArrayAndLinkArray('Gener', data);
    } else if (item.name == 'Line') {
      makeNodeArrayAndLinkArray('Line', data);
    } else if (item.name == 'Load') {
      makeNodeArrayAndLinkArray('Load', data);
    } else if (item.name == 'Shunt') {
      makeNodeArrayAndLinkArray('Shunt', data);
    } else if (item.name == 'Switch') {
      makeNodeArrayAndLinkArray('Breaker', data);
    } else if (item.name == 'EmsNode') {
      makeNodeArrayAndLinkArray('Node', data);
    } else if (item.name == 'Transformers 3Winding') {
      makeNodeArrayAndLinkArray('Transf3w', data);
    } else if (item.name == 'Transformers 2Winding') {
      makeNodeArrayAndLinkArray('Transf2w', data);
    } else if ((item.name == 'Series Impedances', data)) {
      makeNodeArrayAndLinkArray('Scap', data);
    }
  }
  let nodes = await getNodeDataWithDefinition();
  let data_nodes = nodes.data;
  makeNodeNodeArrayAndLinkArray('Node', data_nodes);
};

const init = async () => {
  await getDefinitionListInStation('');
  await getEquipmentInStation();
  console.log('XXXX');
  const _this = this;
  const $ = go.GraphObject.make; // for conciseness in defining templates

  myDiagram = $(go.Diagram, 'myDiagramDiv', {
    'draggingTool.isGridSnapEnabled': true, // dragged nodes will snap to a grid of 10x10 cells
    'undoManager.isEnabled': true,
    'grid.visible': false,
  });
  // install the PortShiftingTool as a "mouse move" tool
  myDiagram.toolManager.mouseMoveTools.insertAt(0, new PortShiftingTool.PortShiftingTool());

  // when the document is modified, add a "*" to the title Bus enable the "Save" button
  myDiagram.addDiagramListener('Modified', (e) => {
    var button = document.getElementById('saveModel');
    if (button) button.disabled = !myDiagram.isModified;
    var idx = document.title.indexOf('*');
    if (myDiagram.isModified) {
      if (idx < 0) document.title += '*';
    } else {
      if (idx >= 0) document.title = document.title.slice(0, idx);
    }
  });

  var palette = $(go.Palette, 'palette'); // create a new Palette in the HTML DIV element "palette"

  myDiagram.linkTemplate = $(
    go.Link,
    {
      routing: go.Link.AvoidsNodes || go.Link.Orthogonal,
      curve: go.Link.JumpOver,
      corner: 3,
      relinkableFrom: true,
      relinkableTo: true,
      selectionAdorned: false, // Links are Gener adorned when selected so that their color remains visible.
      shadowOffset: new go.Point(0, 0),
      shadowBlur: 5,
      shadowColor: 'blue',
    },
    new go.Binding('isShadowed', 'isSelected').ofObject(),
    $(go.Shape, {
      strokeWidth: 2,
      stroke: 'red',
      name: 'SHAPE',
    }),
  );

  // node template helpers
  var sharedToolTip = go.GraphObject.build('ToolTip', { 'Border.figure': 'RoundedRectangle' }).add(
    new go.TextBlock({ margin: 2 }).bind('text', '', (d) => d.category),
  );
  // define some common property settings
  const nodeStyle = (graphObj) => {
    Object.assign(graphObj, {
      selectionAdorned: false,
      shadowOffset: new go.Point(0, 0),
      shadowBlur: 15,
      shadowColor: 'blue',
      locationSpot: go.Spot.Center,
      locationObjectName: 'NODESHAPE',
      resizable: false,
      resizeObjectName: 'NODESHAPE',
      toolTip: sharedToolTip,
    });
    // Add bindings separately
    graphObj.bind(new go.Binding('isShadowed', 'isSelected').ofObject());
    graphObj.bind(new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify));

    return graphObj;
  };
  const shapeStyle = (graphObj) => {
    Object.assign(graphObj, {
      name: 'NODESHAPE',
      fill: 'lightgray',
      stroke: 'darkslategray',
      desiredSize: new go.Size(40, 40),
      strokeWidth: 2,
    });
  };
  const shuntStyle = (graphObj) => {
    Object.assign(graphObj, {
      name: 'NODESHAPE',
      fill: 'lightgray',
      stroke: 'darkslategray',
      desiredSize: new go.Size(20, 40),
      strokeWidth: 2,
    });
  };
  const groundStyle = (graphObj) => {
    Object.assign(graphObj, {
      name: 'NODESHAPE',
      fill: 'lightgray',
      stroke: 'darkslategray',
      desiredSize: new go.Size(40, 20),
      strokeWidth: 2,
    });
  };
  const transfStyle = (graphObj) => {
    Object.assign(graphObj, {
      name: 'NODESHAPE',
      fill: null,
      stroke: 'darkslategray',
      desiredSize: new go.Size(40, 40),
      strokeWidth: 2,
    });
  };
  const BusStyle = (graphObj) => {
    Object.assign(graphObj, {
      name: 'NODESHAPE',
      fill: 'lightgray',
      stroke: 'darkslategray',
      desiredSize: new go.Size(40, 40),
      strokeWidth: 5,
    });
  };
  const NodeStyle = (graphObj) => {
    Object.assign(graphObj, {
      name: 'NODESHAPE',
      fill: 'lightgray',
      stroke: 'darkslategray',
      desiredSize: new go.Size(15, 15),
      strokeWidth: 2,
    });
  };

  const portStyle = (id, input, align, spot = go.Spot.AllSides, maxLink = 1, isBidirectional = false) => {
    return (graphObj) => {
      Object.assign(
        graphObj,
        {
          portId: id,
          desiredSize: new go.Size(6, 6),
          alignment: align,
          fill: 'lime',
          fromSpot: spot,
          fromLinkable: !input || isBidirectional,
          toSpot: spot,
          toLinkable: input || isBidirectional,
          toMaxLinks: maxLink,
          cursor: 'pointer',
          opacity: 1,
        },
        new go.Binding('alignment', id + 'Spot', go.Point.parse).makeTwoWay(go.Point.stringify),
      );
    };
  };

  // define templates for each type of node
  const inputTemplate = new go.Node('Spot', {
    doubleClick: (e, obj) => {
      if (!(obj instanceof go.Node)) return;
      e.diagram.startTransaction('Toggle Input');
      const shp = obj.findObject('NODESHAPE');
      shp.fill = shp.fill === green ? red : green;
      updateStates();
      e.diagram.commitTransaction('Toggle Input');
    },
  })
    .apply(nodeStyle)
    .add(
      new go.Shape('Circle', { fill: red }).apply(shapeStyle), // override the default fill (from shapeStyle()) to be red
      new go.Shape('Rectangle').apply(portStyle('', false, new go.Spot(1, 0.5))), // the only port
    );
  const Transf3wTemplate = new go.Node('Spot')
    .apply(nodeStyle)
    .add(
      // Hình tròn đầu tiên (bỏ fill)
      new go.Shape('Ellipse', {
        strokeWidth: 2,
        width: 40, // Kích thước hình tròn
        height: 40, // Kích thước hình tròn
        alignment: new go.Spot(0.5, 0), // Hình tròn trên cùng
      }).apply(transfStyle),

      // Hình tròn thứ hai (trái, bỏ fill)
      new go.Shape('Ellipse', {
        strokeWidth: 2,
        width: 40, // Kích thước hình tròn
        height: 40, // Kích thước hình tròn
        alignment: new go.Spot(0.25, 1), // Hình tròn ở dưới bên trái
      }).apply(transfStyle),

      // Hình tròn thứ ba (phải, bỏ fill)
      new go.Shape('Ellipse', {
        strokeWidth: 2,
        width: 40, // Kích thước hình tròn
        height: 40, // Kích thước hình tròn
        alignment: new go.Spot(0.75, 1), // Hình tròn ở dưới bên phải
      }).apply(transfStyle),

      // Đường thẳng trên hình tròn đầu tiên
      new go.Shape('LineV', {
        strokeWidth: 2,
        stroke: 'black',
        height: 10,
        alignment: new go.Spot(0.5, -0.1), // Đặt đường thẳng trên hình tròn đầu tiên
      }),

      // Đường thẳng dưới hình tròn trái
      new go.Shape('LineV', {
        strokeWidth: 2,
        stroke: 'black',
        height: 13,
        alignment: new go.Spot(0.02, 1.55), // Đặt đường thẳng dưới hình tròn thứ hai bên trái
      }),

      // Đường thẳng dưới hình tròn phải
      new go.Shape('LineV', {
        strokeWidth: 2,
        stroke: 'black',
        height: 13,
        alignment: new go.Spot(0.98, 1.55), // Đặt đường thẳng dưới hình tròn thứ ba bên phải
      }),
      new go.Shape('Rectangle').apply(portStyle('in3', false, new go.Spot(0.5, -0.2), go.Spot.TopSide)),
      new go.Shape('Rectangle').apply(portStyle('in2', false, new go.Spot(0.02, 1.7), go.Spot.BottomSide)),
      new go.Shape('Rectangle').apply(portStyle('in1', false, new go.Spot(0.98, 1.7), go.Spot.BottomSide)),
    )
    .add(
      new go.TextBlock({
        margin: 5,
        editable: true,
        textAlign: 'center',
      })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(1.6, 1) }), // Đặt văn bản ở dưới
    );
  const Transf2wTemplate = new go.Node('Spot')
    .apply(nodeStyle)
    .add(
      // Hình tròn đầu tiên (bỏ fill)
      new go.Shape('Ellipse', {
        name: 'ELLIPSE1',
        strokeWidth: 2,
        width: 50, // Kích thước hình tròn
        height: 50, // Kích thước hình tròn
        alignment: new go.Spot(0.5, 0), // Đặt hình tròn đầu tiên ở trên
      }).apply(transfStyle),

      // Hình tròn thứ hai (bỏ fill)
      new go.Shape('Ellipse', {
        name: 'ELLIPSE2',
        strokeWidth: 2,
        width: 50, // Kích thước hình tròn
        height: 50, // Kích thước hình tròn
        alignment: new go.Spot(0.5, 0), // Đặt hình tròn thứ hai ở dưới
      }).apply(transfStyle),

      // Đường thẳng trên hình tròn đầu tiên
      new go.Shape('LineH', {
        strokeWidth: 2,
        stroke: 'black',
        geometryString: 'M25 0 V-10', // Đường thẳng đứng trên cùng
        alignment: new go.Spot(0.5, -0.6), // Đặt đường thẳng trên hình tròn đầu tiên
      }),

      // Đường thẳng dưới hình tròn thứ hai
      new go.Shape('LineH', {
        strokeWidth: 2,
        stroke: 'black',
        geometryString: 'M25 0 V-10', // Đường thẳng đứng dưới hình tròn thứ hai
        alignment: new go.Spot(0.5, 1.1), // Đặt đường thẳng dưới hình tròn thứ hai
      }),
      new go.Shape('Rectangle').apply(portStyle('in1', false, new go.Spot(0.5, -0.7), go.Spot.TopSide)),
      new go.Shape('Rectangle').apply(portStyle('in2', false, new go.Spot(0.5, 1.2), go.Spot.BottomSide)),
    )
    .add(
      new go.TextBlock({
        margin: 5,
        editable: true,
        textAlign: 'center',
      })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(1.3, 0.3) }), // Đặt văn bản ở dưới
    );
  const BusTemplate = new go.Node('Spot')
    .apply(nodeStyle)
    .add(
      new go.Shape('LineH').apply(BusStyle),
      new go.Shape('Rectangle').apply(portStyle('in1', true, new go.Spot(0, 0.5), go.Spot.AllSides, 99)),
    )
    .add(
      new go.TextBlock({ margin: 5, editable: true, textAlign: 'center', angle: 0 })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(0, 0.2) }), // Đặt văn bản ở dưới
    );

  const NodeTemplate = new go.Node('Spot')
    .apply(nodeStyle)
    .add(
      new go.Shape('Ellipse').apply(NodeStyle),
      new go.Shape('Rectangle').apply(portStyle('in1', true, new go.Spot(0.5, 0.5), go.Spot.AllSides, 100, false)),
    )
    .add(
      new go.TextBlock({ margin: 5, editable: true, textAlign: 'center', angle: 0 })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(0.5, 1.5) }), // Đặt văn bản ở dưới
    );

  const LineTemplate = new go.Node('Spot')
    .apply(nodeStyle)
    .add(
      new go.Shape('LineV').apply(shapeStyle),
      new go.Shape('Rectangle').apply(portStyle('in1', false, new go.Spot(0.5, 0), go.Spot.TopSide)),
      new go.Shape('Rectangle').apply(portStyle('in2', false, new go.Spot(0.5, 1), go.Spot.BottomSide)),
    )
    .add(
      new go.TextBlock({ margin: 5, editable: true, textAlign: 'center', angle: -90 })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(0.2, 0.5) }), // Đặt văn bản ở dưới
    );

  const LoadTemplate = new go.Node('Spot')
    .apply(nodeStyle)
    .add(new go.Shape('TriangleDown').apply(shapeStyle))
    .add(
      new go.Shape('LineV', {
        stroke: 'black',
        strokeWidth: 2,
        height: 30, // Chiều cao đường thẳng
        alignment: new go.Spot(0.5, -0.3), // Đặt đường thẳng giữa cạnh trên tam giác
      }),
      new go.Shape('Rectangle').apply(portStyle('in1', false, new go.Spot(0.5, -0.6), go.Spot.TopSide)),
    )
    .add(
      new go.TextBlock({ margin: 5, editable: true, textAlign: 'center' })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(0.5, 1.2) }), // Đặt văn bản ở dưới
    );

  const ShuntTemplate = new go.Node('Spot')
    .apply(nodeStyle)
    .add(new go.Shape('Capacitor', { angle: -90, alignment: new go.Spot(0.5, 0) }).apply(shuntStyle))
    .add(new go.Shape('Ground', { angle: -0, alignment: new go.Spot(0.5, 1.7) }).apply(groundStyle))

    .add(
      new go.Shape('LineV', {
        stroke: 'black',
        strokeWidth: 2,
        height: 20, // Chiều cao đường thẳng
        alignment: new go.Spot(0.5, -0.4), // Đặt đường thẳng giữa cạnh trên tam giác
      }),

      new go.Shape('Rectangle').apply(portStyle('in1', false, new go.Spot(0.5, -0.7), go.Spot.TopSide)),
    )
    .add(
      new go.TextBlock({ margin: 5, editable: true, textAlign: 'center' })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(0.5, 3.2) }), // Đặt văn bản ở dưới
    );

  const BreakerTemplate_v1 = new go.Node('Spot')
    .apply(nodeStyle)
    .add(
      new go.Shape('RoundedRectangle').apply(shapeStyle),
      new go.Shape('Rectangle').apply(portStyle('in1', false, new go.Spot(0.5, 0), go.Spot.TopSide)),
      new go.Shape('Rectangle').apply(portStyle('in2', false, new go.Spot(0.5, 1), go.Spot.BottomSide)),
    )
    .add(
      new go.TextBlock({
        margin: new go.Margin(5, 5, 5, 5),
        editable: true,
        textAlign: 'left',
        wrap: go.TextBlock.WrapFit,
        alignment: go.Spot.Left,
      })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(-0.5, 0.5) }), // Đặt văn bản ở dưới
    );
  const BreakerTemplate = new go.Node('Horizontal').apply(nodeStyle).add(
    // Hình chữ nhật
    new go.Panel('Vertical').add(
      new go.Shape('Rectangle').apply(portStyle('in2', false, new go.Spot(0.5, -0.1), go.Spot.TopSide)),
      new go.Shape('RoundedRectangle', {
        width: 100, // Kích thước cố định cho hình chữ nhật
        height: 40,
        fill: 'lightgray',
        stroke: 'black',
        strokeWidth: 2,
      }).apply(shapeStyle),
      new go.Shape('Rectangle').apply(portStyle('in1', false, new go.Spot(0.5, 1), go.Spot.BottomSide)),
    ),
    // Văn bản nằm bên ngoài, bên trái hình chữ nhật
    new go.TextBlock({
      margin: new go.Margin(0, 5, 0, 0),
      editable: true,
      textAlign: 'left',
      wrap: go.TextBlock.None,
      overflow: go.TextBlock.OverflowClip,
      maxSize: new go.Size(80, NaN),
      minSize: new go.Size(30, NaN),
    })
      .bind('text', 'name')
      .set({
        alignment: new go.Spot(0, 0.5),
      }),
  );
  const ScapTemplate = new go.Node('Spot')
    .apply(nodeStyle)
    .add(
      new go.Shape('Inductor').apply(shapeStyle),
      new go.Shape('Rectangle').apply(portStyle('in1', false, new go.Spot(0, 0.5), go.Spot.LeftSide)),
      new go.Shape('Rectangle').apply(portStyle('in2', false, new go.Spot(1, 0.5), go.Spot.RightSide)),
    )
    .add(
      new go.TextBlock({ margin: 5, editable: true, textAlign: 'center' })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(0.5, 1.2) }), // Đặt văn bản ở dưới
    );

  const generTemplate = new go.Node('Spot', {
    doubleClick: (e, obj) => {
      if (!(obj instanceof go.Node)) return;
      e.diagram.startTransaction('Toggle Input');
      const shp = obj.findObject('NODESHAPE');
      shp.fill = shp.fill === green ? red : green;
      updateStates();
      e.diagram.commitTransaction('Toggle Input');
    },
  })
    .apply(nodeStyle)
    .add(
      new go.Shape('ACvoltageSource', { fill: 'red' }).apply(shapeStyle),
      new go.Shape('Rectangle').apply(portStyle('in1', false, new go.Spot(0.5, 0), go.Spot.TopSide)),
    )
    .add(
      new go.TextBlock({ margin: 5, editable: true, textAlign: 'center' })
        .bind('text', '', (d) => d.name)
        .set({ alignment: new go.Spot(0.5, 1.2) }), // Đặt văn bản ở dưới
    );

  // add the templates created above to myDiagram Bus palette
  myDiagram.nodeTemplateMap.add('Transf3w', Transf3wTemplate);
  myDiagram.nodeTemplateMap.add('Transf2w', Transf2wTemplate);
  myDiagram.nodeTemplateMap.add('Bus', BusTemplate);
  myDiagram.nodeTemplateMap.add('Node', NodeTemplate);
  myDiagram.nodeTemplateMap.add('Line', LineTemplate);
  myDiagram.nodeTemplateMap.add('Gener', generTemplate);
  myDiagram.nodeTemplateMap.add('Scap', ScapTemplate);
  myDiagram.nodeTemplateMap.add('Load', LoadTemplate);
  myDiagram.nodeTemplateMap.add('Breaker', BreakerTemplate);
  myDiagram.nodeTemplateMap.add('Shunt', ShuntTemplate);

  // share the template map with the Palette
  palette.nodeTemplateMap = myDiagram.nodeTemplateMap;

  palette.model.nodeDataArray = [
    { category: 'Breaker', name: 'CB' },
    { category: 'Node', name: 'Node' },
    { category: 'Transf3w', name: 'T3' },
    { category: 'Transf2w', name: 'T2' },
    { category: 'Bus', name: 'Bus' },
    { category: 'Line', name: 'Line' },
    { category: 'Gener', name: 'Gener' },
    { category: 'Scap', name: 'Scap' },
    { category: 'Load', name: 'Load' },
    { category: 'Shunt', name: 'Shunt' },
  ];

  // load the initial diagram
  load();

  // continually update the diagram
  loop();
};

// update the diagram every 250 milliseconds
const loop = () => {
  setTimeout(() => {
    updateStates();
    loop();
  }, 250);
};

// update the value Bus appearance of each node according to its type Bus input values
const updateStates = () => {
  var oldskip = myDiagram.skipsUndoManager;
  myDiagram.skipsUndoManager = true;
  // do all "input" nodes first
  myDiagram.nodes.each((node) => {
    if (node.category === 'Gener') {
      doGener(node);
    }
  });
  // now we can do all other kinds of nodes
  myDiagram.nodes.each((node) => {
    switch (node.category) {
      case 'Bus':
        doAnd(node);
        break;
      case 'Node':
        doNode(node);
        break;
      case 'Line':
        doXor(node);
        break;
      case 'Gener':
        doGener(node);
        break;
      case 'Scap':
        doScap(node);
        break;
      case 'Load':
        doNor(node);
        break;
      case 'Breaker':
        doBreaker(node);
        break;
      case 'Transf2w':
        doOutput(node);
        break;
      case 'Transf3w':
        break; // doGener already called, above
    }
  });
  myDiagram.skipsUndoManager = oldskip;
};

// helper predicate
const linkIsTrue = (link) => {
  // assume the given Link has a Shape named "SHAPE"
  return link.findObject('SHAPE').stroke === green;
};

// helper const for propagating results
const setOutputLinks = (node, color) => {
  node.findLinksOutOf().each((link) => (link.findObject('SHAPE').stroke = color));
};

// update nodes by the specific const for its type
// determine the color of links coming out of this node based on those coming in Bus node type

const doGener = (node) => {
  // the T is just the node's Shape.fill
  setOutputLinks(node, node.findObject('NODESHAPE').fill);
};

const doAnd = (node) => {
  var color = node.findLinksInto().all(linkIsTrue) ? green : red;
  setOutputLinks(node, color);
};

const doScap = (node) => {
  var color = !node.findLinksInto().all(linkIsTrue) ? green : red;
  setOutputLinks(node, color);
};

const doNode = (node) => {
  var color = node.findLinksInto().any(linkIsTrue) ? green : red;
  setOutputLinks(node, color);
};

const doNor = (node) => {
  var color = !node.findLinksInto().any(linkIsTrue) ? green : red;
  setOutputLinks(node, color);
};

const doXor = (node) => {
  var truecount = 0;
  node.findLinksInto().each((link) => {
    if (linkIsTrue(link)) truecount++;
  });
  var color = truecount % 2 !== 0 ? green : red;
  setOutputLinks(node, color);
};

const doBreaker = (node) => {
  var truecount = 0;
  node.findLinksInto().each((link) => {
    if (linkIsTrue(link)) truecount++;
  });
  var color = truecount % 2 === 0 ? green : red;
  setOutputLinks(node, color);
};

const doOutput = (node) => {
  // assume there is just one input link
  // we just need to update the node's Shape.fill
  node.linksConnected.each((link) => {
    node.findObject('NODESHAPE').fill = link.findObject('SHAPE').stroke;
  });
};

// save a model to Bus load a model from Json text, displayed below the Diagram
const save = () => {
  document.getElementById('mySavedModel').value = myDiagram.model.toJson();
  myDiagram.isModified = false;
};
const load = () => {
  console.log(networkData);
  myDiagram.model = go.Model.fromJson(JSON.stringify(networkData));
};

onMounted(async () => {
  init();
});
watch(isDarkTheme, () => {});
const refeshData = () => {
  emits('refeshData');
};
</script>

<template>
  <div class="card flex justify-content-center h-full">
    <modificationTimeFile :modificationTime="modificationTime" @refeshData="refeshData"></modificationTimeFile>
    <div style="width: 100%; display: flex; justify-content: space-between">
      <div
        id="palette"
        style="width: 100px; height: 500px; margin-right: 2px; background-color: whitesmoke; border: solid 1px black"
      ></div>
      <div id="myDiagramDiv" style="flex-grow: 1; height: 500px; border: solid 1px black"></div>
      <div id="buttons">
        <button id="saveModel" @click="save()">Save</button>
        <button id="loadModel" @click="load()">Load</button>
      </div>
      <textarea id="mySavedModel" style="width: 20%; height: 200px">
        { "class": "GraphLinksModel",
  "linkFromPortIdProperty": "fromPort",
  "linkToPortIdProperty": "toPort",
  "nodeDataArray": [
{"category":"Node","key":"node1","name":"a12","loc":"-70 0"},
{"category":"Line","key":"line1","name":"a14","loc":"100 40"},
{"category":"Transf3w","name":"T3","key":-3,"loc":"-190 110"},
{"category":"Node","name":"Node","key":-2,"loc":"-170 270"},
{"category":"Node","name":"Node","key":-8,"loc":"-210 270"},
{"category":"Breaker","name":"CB","key":-1,"loc":"100 190"},
{"category":"Node","name":"Node","key":-7,"loc":"100 90"},
{"category":"Gener","name":"Gener","key":-9,"loc":"100 350"},
{"category":"Node","name":"Node","key":-10,"loc":"100 270"}
],
  "linkDataArray": [
{"from":-3,"to":"node1","fromPort":"in1","toPort":"in1"},
{"from":-3,"to":-2,"fromPort":"in3","toPort":"in1"},
{"from":-3,"to":-8,"fromPort":"in2","toPort":"in1"},
{"from":"line1","to":"node1","fromPort":"in1","toPort":"in1"},
{"from":-1,"to":-7,"fromPort":"in1","toPort":"in1"},
{"from":"line1","to":-7,"fromPort":"in2","toPort":"in1"},
{"from":-9,"to":-10,"fromPort":"in1","toPort":"in1"},
{"from":-1,"to":-10,"fromPort":"in2","toPort":"in1"}
]}
  </textarea
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: 0;
  position: relative;
  // padding: 5px 5px 5px 5px;
  padding: 10px;
  .icon-chart {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1rem;
    color: var(--primary-color);
    display: block;
    text-align: center;
    i {
      display: block;
      margin: 0 auto; /* Để căn giữa theo chiều ngang */
    }
    span {
      display: block;
      margin: 4px auto;
      font-size: 0.6rem;
      color: #808080;
    }
  }
}
/*
.p-chart {
  max-width: calc(100vh - 16rem) !important;
  width: 95%;
  height: 100%;
}
*/
</style>
