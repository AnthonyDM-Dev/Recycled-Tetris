<template>
  <div id="info-popup">
    <p>{{ fact }}</p>
  </div>
</template>

<script>
import gameFunctions from '../assets/tetris/gameFunctions.js';
export default {
  name: 'InfoPopup',
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      facts: [
        'Plastic bottles require up to 450 years to dissolve',
        '90% of the cost of bottled water is the bottle itself',
        '80% of plastic bottles never get recycled',
        '38 million plastic bottles go to landfill each year in America alone',
        '24,000,000 liters of oil is needed to produce billions of plastic bottles',
        'The average American consumes 217 bottles of water per year',
        'Plastic is made from fossil fuels',
        'More than 40 percent of plastic is used just once before it is thrown away',
        '5 trillion pieces of plastic are already floating in our oceans',
        'There is a plastic island in the ocean three times bigger than France',
        'There will be more plastic in our oceans than fish by 2050',
        'A whopping 2 million plastic bags are used every minute worldwide',
        'Single-use plastics are illegal in some parts of the world',
        'Every minute of every day a truckload of plastic is dumped into the ocean',
        '73% of beach litter worldwide is plastic',
        'One million plastic bottles are bought every minute',
        '99% of seabirds will be eating plastic by 2050',
        'The average person eats 70,000 microplastics each year',
        'The average time that a plastic bag is used is just 12 minutes',
        'Over the past 50 years, world plastic production has doubled'
      ]
    }
  },
  computed: {
    fact() {
      if (!this.isVisible) return '';
      return this.facts[gameFunctions.getRandomNumInRange(0, (this.facts.length - 1))];
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/info-popup.scss';
</style>
