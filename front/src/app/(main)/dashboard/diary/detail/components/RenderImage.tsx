"use client";

import React from "react";

const openImageInNewTab = (imageUrl: string) => {
	window.open(imageUrl, "_blank");
};

type RenderImageProps = {
	src: string;
	alt: string;
}

const RenderImage = ({ src, alt }: RenderImageProps) => {
	return (
		<img
			src={src}
			alt={alt}
			className="w-full h-64 object-cover rounded-lg"
			onClick={() => openImageInNewTab(src)}
		/>
	)
}

export default RenderImage;
