
export default class simulate{
	constructor(){
       this.dgn =window.dgn;
	}
	static AddElmToList(elmId,viewIdx,listIdx) {
	    window.dgn.AddElementToList(elmId, viewIdx, listIdx);
	}
	static ClearElementList(viewidx,listIdx) {
	    window.dgn.ClearElementList(viewidx, listIdx);
	}
	static OnBeginSimulate() {
	    window.dgn.BeginSimulate();
	}
	static OnStartSimulate(showOrHide, doDynamic) {
	    window.dgn.SimulateSchedual(showOrHide, doDynamic);
	}
	static OnStopSimulate(isLast) {
	    window.dgn.StopSimulate(isLast);
	}
	static OnFullView() {
	    window.dgn.ViewOperation(2,1);
	}
	// 通过modelId来显示系统model
	// isLast需要刷新时则为true
	static ChangeModelDisplayById(id, beDisplayed, isLast){
		window.dgn.ChangeModelDisplayById(id, beDisplayed, isLast);
	}
	static ChangeLevelDisplay(id, beDisplayed, isLast){
		window.dgn.ChangeLevelDisplay(id, beDisplayed, isLast);
	}
	static GetLevelListByModelId(id){
		window.dgn.GetLevelListByModelId(id);
	}
	static OnLocateElement(elmId, elmModelName) {
	    window.dgn.LocateElementWithoutLoc(elmId, false, true, true);
	}

 	static DoMark(showHide){
	    window.dgn.MarkElements(showHide);
	}

	static DoHilite(doHilite) {
	    window.dgn.HiliteElements(doHilite);
	}
	static SetSimulateDate(viewidx, textStr) {
	    window.dgn.SetSimulateOverlayText(viewidx, textStr);
	}
}
