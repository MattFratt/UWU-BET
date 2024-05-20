<template>
    <div class="wheel-of-fortune">
        <div class="controls">
            <label for="betAmount">Bet Amount:</label>
            <input type="number" id="betAmount" v-model.number="betAmount" min="1">

            <label for="riskLevel">Risk Level (1-10):</label>
            <input type="range" id="riskLevel" v-model.number="riskLevel" min="1" max="10">
        </div>

        <div class="wheel-container">
            <div class="wheel" ref="wheel">
                <div v-for="(slice, index) in slices" :key="index"
                    :class="['slice', { winning: slice.winning, losing: slice.losing }]"
                    :style="{ transform: `rotate(${index * (360 / slices.length)}deg) skewY(-30deg)` }">
                    <span class="label">{{ slice.label }}</span>
                </div>
            </div>
            <div class="arrow"></div>
        </div>

        <div class="controls">
            <button v-if="!hasBetToday" @click="spinWheel">Spin Wheel</button>
            <button v-else @click="placeBet">Place Bet</button>
            <p v-if="hasBetToday">You have already placed your bet for today. Come back tomorrow!</p>
        </div>
    </div>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig.js';

export default {
    data() {
        return {
            hasBetToday: false,
            user: null,
            betAmount: 1,
            riskLevel: 5,
            slices: [],
        };
    },
    watch: {
        riskLevel(newRiskLevel) {
            this.updateSlices(newRiskLevel);
        }
    },
    mounted() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user;
                await this.checkBetStatus();
                this.updateSlices(this.riskLevel);
            } else {
                this.user = null;
                this.hasBetToday = false;
            }
        });
    },
    methods: {
        updateSlices(riskLevel) {
            const totalSlices = 12;
            const winningSlices = totalSlices - riskLevel + 1; // Decrease winning slice count with higher risk
            this.slices = Array(totalSlices).fill().map((_, i) => ({
                winning: i < winningSlices, // Winning slices are at the beginning
                losing: i >= winningSlices, // Losing slices are at the end
                label: i < winningSlices ? 'Win' : (i >= winningSlices ? 'Lose' : `Slice ${i + 1}`)
            }));
        },
        async checkBetStatus() {
            if (this.user) {
                const userBetRef = doc(db, "userBets", this.user.uid);
                const userBetDoc = await getDoc(userBetRef);
                if (userBetDoc.exists()) {
                    const betDate = userBetDoc.data().betDate.toDate();
                    const today = new Date();
                    if (betDate.toDateString() === today.toDateString()) {
                        this.hasBetToday = true;
                    } else {
                        this.hasBetToday = false;
                    }
                }
            }
        },
        async placeBet() {
            if (this.user) {
                const userBetRef = doc(db, "userBets", this.user.uid);
                await setDoc(userBetRef, {
                    betDate: Timestamp.fromDate(new Date()),
                    betAmount: this.betAmount,
                    riskLevel: this.riskLevel,
                });
                this.hasBetToday = true;
            }
        },
        spinWheel() {
            const wheel = this.$refs.wheel;
            const rotation = Math.floor(Math.random() * 3600) + 360; // Add extra spins for effect
            wheel.style.transition = 'transform 4s ease-out';
            wheel.style.transform = `rotate(${rotation}deg)`;

            setTimeout(() => {
                const normalizedRotation = rotation % 360;
                const sliceAngle = 360 / this.slices.length;
                const winningSliceIndex = Math.floor(normalizedRotation / sliceAngle);
                this.slices.forEach((slice, index) => {
                    slice.winning = index === winningSliceIndex;
                    slice.losing = index !== winningSliceIndex && slice.losing;
                });
                this.placeBet();
            }, 4000);
        },
    },
};
</script>


<style scoped>
.wheel-of-fortune {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

.controls {
    margin-bottom: 20px;
}

.wheel-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    position: relative;
}

.wheel {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    background: #fff;
    border: 5px solid #000;
}

.slice {
    position: absolute;
    width: 50%;
    height: 100%;
    background: #000;
    transform-origin: right center;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
}

.slice:nth-child(even) {
    background: #ccc;
}

.slice.winning {
    background: #0f0;
}

.slice.losing {
    background: #f00;
}

.label {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    transform-origin: left center;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
}

.arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid #000;
    transform: translate(-50%, -100%);
}
</style>
