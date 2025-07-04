// src/components/FloatingIcons.tsx

const icons = [
	"😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
	"🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
	"😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
	"🤐", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌",
	"😴", "😷", "🤒", "🤕", "🤢", "🤮", "🥵", "🥶", "😵", "🤯",
	"🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮",
	"😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢",
	"😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤",
	"😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "👻", "👽", "🤖",
	"🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",
	"🌟", "✨", "⚡", "🔥", "🌈", "❄️", "💧", "🌊", "🍀", "🌸",
	"🌼", "🌻", "🌙", "☀️", "🌤", "🌍", "🌎", "🌌", "🪐", "🚀",
	"🛰", "🛸", "💡", "📱", "💻", "🎧", "🎮", "📷", "🎥", "🎞",
	"🎬", "📚", "📖", "✏️", "🖊️", "📝", "📌", "📍", "📎", "🧷",
	"🧲", "📦", "🛍️", "🎁", "💰", "💎", "⚙️", "🧠", "🦾", "🫀",
];; // you can customize these

const FloatingIcons = () => {
	return (
		<div className="floating-icons">
			{icons.map((icon, i) => (
				<span
					key={i}
					className="floating-icon"
					style={{
						top: `${Math.random() * 100}%`,
						left: `${Math.random() * 100}%`,
						animationDuration: `${6 + Math.random() * 6}s`,
						animationDelay: `${Math.random() * 3}s`,
					}}
				>
					{icon}
				</span>
			))}
		</div>
	);
};

export default FloatingIcons;
