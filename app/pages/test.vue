<template>
  <div></div>
</template>
<script>
export default {
  setup() {
    const data_1 = ref([
      {
        labName: 'OOO Анализ',
        testCode: 'PH-An',
        labProdId: '1111',
        clientProdId: 'Table',
        analyteName: 'Width',
        replica: 1,
        result: 50
      },
      {
        labName: 'OOO Анализ',
        testCode: 'PH-An',
        labProdId: '1111',
        clientProdId: 'Table',
        analyteName: 'Width',
        replica: 2,
        result: 51
      },
      {
        labName: 'OOO Анализ',
        testCode: 'PH-An',
        labProdId: '1111',
        clientProdId: 'Table',
        analyteName: 'Length',
        replica: 1,
        result: 50
      },
      {
        labName: 'OOO Анализ',
        testCode: 'PH-An',
        labProdId: '1111',
        clientProdId: 'Table',
        analyteName: 'Length',
        replica: 2,
        result: 51
      }
    ])

    const data_2 = ref([
      {
        labName: 'OOO Анализ',
        testCode: 'PH-An',
        labProdId: '1111',
        clientProdId: 'Table',
        analyteName: 'Width',
        replica: 1,
        result: 50
      },
    ])

    const data_3 = ref([
      {}
    ])



    return {
      data_1,
      data_2,
      data_3
    }
  }
}
</script>
