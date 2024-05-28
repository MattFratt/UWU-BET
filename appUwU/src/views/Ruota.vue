<template>
    <div class="wrapper">
        <div class="container">
            <canvas id="wheel" ref="wheel"></canvas>
            <button id="spin-btn" @click="spinWheel">Spin</button>
            <div id="arrow"></div>
        </div>
        <div id="final-value">
            <p>{{ message }}</p>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            slices: ['Slice 1', 'Slice 2', 'Slice 3', 'Slice 4', 'Slice 5', 'Slice 6'],
            selectedSlice: null,
            message: 'Click On The Spin Button To Start',
        };
    },
    mounted() {
        this.$nextTick(() => {
            const canvas = this.$refs.wheel;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            this.drawWheel();
        });
    },
    methods: {
        drawWheel() {
            const canvas = this.$refs.wheel;
            const ctx = canvas.getContext('2d');
            const radius = canvas.height / 2;
            ctx.translate(radius, radius);
            const arc = (2 * Math.PI) / this.slices.length;

            this.slices.forEach((slice, index) => {
                ctx.beginPath();
                ctx.arc(0, 0, radius, index * arc, (index + 1) * arc);
                ctx.fillStyle = index % 2 === 0 ? '#ddd' : '#bbb';
                ctx.fill();

                ctx.save();
                ctx.rotate((index + 0.5) * arc);
                ctx.fillStyle = '#000';
                ctx.fillText(slice, radius / 2, 0);
                ctx.restore();
            });
        },
        spinWheel() {
            const wheel = this.$refs.wheel;
            const selectedSliceIndex = Math.floor(Math.random() * this.slices.length);
            this.selectedSlice = this.slices[selectedSliceIndex];
            const sliceAngle = 360 / this.slices.length;
            const rotation = ((this.slices.length - selectedSliceIndex) * sliceAngle) + (Math.floor(Math.random() * 5) + 1) * 360; // Add extra spins for effect
            wheel.style.transition = 'transform 4s ease-out';
            wheel.style.transform = `rotate(${rotation}deg)`;

            setTimeout(() => {
                this.message = `The wheel landed on ${this.selectedSlice}`;
            }, 4000);
        },
    },
};
</script>
  
<style scoped>
.container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    /* Adjust this to fit your needs */
}

#wheel {
    /* Adjust these to fit your needs */
    width: 300px;
    height: 300px;
}

#arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 40px solid red;
    transform: translate(-50%, -100%);
}
</style>