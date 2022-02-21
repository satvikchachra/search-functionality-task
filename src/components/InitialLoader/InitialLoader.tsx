import PolymerIcon from "@material-ui/icons/Polymer";

const InitialLoader = () => {
  return (
    <div className={"overlay"}>
      <div className={"animate-icon"}>
        <PolymerIcon />
      </div>
    </div>
  );
};

export default InitialLoader;
