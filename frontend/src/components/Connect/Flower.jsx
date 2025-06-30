import { useDrag, DragPreviewImage } from "react-dnd";

const Flower = ({ flower }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "flower",
    item: { id: flower.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      <DragPreviewImage
        connect={preview}
        src={flower.preview || flower.image}
      />
      <img
        ref={drag}
        src={flower.image}
        alt={flower.id}
        style={{
          width: `230px`,
          height: `280px`,
          objectFit: "contain",
          opacity: isDragging ? 1 : 1,
          margin: "10px",
          cursor: "grab",
        }}
      />
    </>
  );
};

export default Flower;
