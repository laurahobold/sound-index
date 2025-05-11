import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

export default function VantaBackground() {
		const vantaRef = useRef(null);
		const [vantaEffect, setVantaEffect] = useState(null);

		useEffect(() => {
				if (!vantaEffect) {
						setVantaEffect(
								FOG({
										el: vantaRef.current,
										THREE,
										mouseControls: true,
										touchControls: true,
										gyroControls: false,
										minHeight: 200.0,
										minWidth: 200.0,
										highlightColor: 0xffffff,
										midtoneColor: 0xb96f87,
										lowlightColor: 0x74d99a,
										baseColor: 0x857193,
										blurFactor: 0.64,
										speed: 1.30,
										zoom: 1.2,
								})
						);
				}

				return () => {
						if (vantaEffect) vantaEffect.destroy();
				};
		}, [vantaEffect]);

		return (
				<div
						ref={vantaRef}
						style={{
								position: 'fixed',
								top: 0,
								left: 0,
								width: '100vw',
								height: '100vh',
								zIndex: -10,
						}}
				/>
		);
}
