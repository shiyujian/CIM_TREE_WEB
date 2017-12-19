/***********************************************/
/*GcmFdeCommon
 /***********************************************/


/*!
 * 对该枚举的说明
 */

export const gviLanguage = {
	gviLanguageChineseSimple: 0,
	gviLanguageChineseTraditional: 1,
	gviLanguageEnglish: 2
};

/***********************************************/
/*GcmFdeCore
 /***********************************************/


/*!
 * 对该枚举的说明
 */
export const gviFieldType = {
	gviFieldUnknown: 0,
	gviFieldInt16: 2,
	gviFieldInt32: 3,
	gviFieldInt64: 4,
	gviFieldFloat: 5,
	gviFieldDouble: 6,
	gviFieldString: 7,
	gviFieldDate: 8,
	gviFieldBlob: 9,
	gviFieldFID: 10,
	gviFieldUUID: 11,
	gviFieldGeometry: 99
};

/*!
 * 对该枚举的说明
 */
export const gviDomainType = {
	gviDomainRange: 0,
	gviDomainCodedValue: 1
};

/*!
 * 对该枚举的说明
 */
export const gviGeometryColumnType = {
	gviGeometryColumnPoint: 0,
	gviGeometryColumnModelPoint: 1,
	gviGeometryColumnPOI: 2,
	gviGeometryColumnMultiPoint: 3,
	gviGeometryColumnPolyline: 4,
	gviGeometryColumnPolygon: 5,
	gviGeometryColumnTriMesh: 7,
	gviGeometryColumnPointCloud: 8,
	gviGeometryColumnCollection: 9,
	gviGeometryColumnUnknown: -1
};

/*!
 * 对该枚举的说明
 */
export const gviIndexType = {
	gviIndexRdbms: 0,
	gviIndexGrid: 3,
	gviIndexRender: 4
};

/*!
 * 对该枚举的说明
 */
export const gviDataSetType = {
	gviDataSetAny: 0,
	gviDataSetDbmsTable: 1,
	gviDataSetObjectClassTable: 2,
	gviDataSetFeatureClassTable: 3
};

/*!
 * 对该枚举的说明
 */
export const gviFilterType = {
	gviFilterAttributeOnly: 1,
	gviFilterWithSpatial: 2,
	gviFilterWithTemporal: 3
};

/*!
 * 对该枚举的说明
 */
export const gviConnectionType = {
	gviConnectionUnknown: 0,
	gviConnectionMySql5x: 2,
	gviConnectionFireBird2x: 3,
	gviConnectionOCI11: 4,
	gviConnectionPg9: 5,
	gviConnectionMSClient: 6,
	gviConnectionSQLite3: 10,
	gviConnectionShapeFile: 12,
	gviConnectionArcGISServer10: 13,
	gviConnectionArcSDE9x: 14,
	gviConnectionArcSDE10x: 15,
	gviConnectionWFS: 16,
	gviConnectionKingBase7: 17,
	gviConnectionCms7Http: 101,
	gviConnectionCms7Https: 102,
	gviConnectionPlugin: 999
};

/*!
 * 对该枚举的说明
 */
export const gviLockType = {
	gviLockSharedSchemaReadonly: 0,
	gviLockSharedSchema: 1,
	gviLockExclusiveSchema: 2
};

/*!
 * 对该枚举的说明
 */
export const gviSpatialRel = {
	gviSpatialRelEnvelope: 0,
	gviSpatialRelEquals: 1,
	gviSpatialRelIntersects: 2,
	gviSpatialRelTouches: 3,
	gviSpatialRelCrosses: 4,
	gviSpatialRelWithin: 5,
	gviSpatialRelContains: 6,
	gviSpatialRelOverlaps: 7
};

/*!
 * 对该枚举的说明
 */
export const gviRenderIndexRebuildType = {
	gviRenderIndexRebuildFlagOnly: 1,
	gviRenderIndexRebuildWithData: 2
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkAttributeUsageType = {
	gviUseAsCost: 0,
	gviUseAsDescriptor: 1,
	gviUseAsRestriction: 2,
	gviUseAsHierarchy: 3
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkElementType = {
	gviJunction: 1,
	gviEdge: 2
};

/*!
 * 对该枚举的说明
 */
export const gviEvaluatorType = {
	gviConstantEvaluator: 0,
	gviFieldEvaluator: 1,
	gviScriptEvaluator: 2
};

/*!
 * 对该枚举的说明
 */
export const gviEdgeDirection = {
	gviNone: 0,
	gviAlongDigitized: 1,
	gviAgainstDigitized: 2
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkType = {
	gviDirectedNetwork: 0,
	gviUnDirectedNetwork: 1
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkElevationModel = {
	gviElevationNone: 0,
	gviElevationFields: 1,
	gviZCoordinates: 2
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkBarrierType = {
	gviJunctionBarrier: 1,
	gviEdgeBarrier: 2
};

/*!
 * 对该枚举的说明
 */
export const gviConstraintBarrierType = {
	gviRestriction: 0,
	gviAddedCost: 1
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkLocationType = {
	gviLocation: 1,
	gviEventLocation: 2
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkLocationOrderPolicy = {
	gviSequence: 1,
	gviFixStart: 2,
	gviFixStartAndReturn: 3,
	gviFixStartEnd: 4,
	gviFree: 5
};

/*!
 * 对该枚举的说明
 */
export const gviFdbCapability = {
	gviFdbCapReplicationCheckOutMaster: 1,
	gviFdbCapQueryResultIndexRange: 2,
	gviFdbCapModifyField: 3,
	gviFdbCapAddField: 4,
	gviFdbCapDeleteField: 5,
	gviFdbCapModifyData: 20
};

/*!
 * 对该枚举的说明
 */
export const gviResultStoreLocation = {
	gviResultStoreLocationServer: 0,
	gviResultStoreLocationClient: 1
};

/*!
 * 对该枚举的说明
 */
export const gviNameType = {
	gviNameDataSource: 0,
	gviNameFeatureDataSet: 1,
	gviNameTable: 2,
	gviNameObjectClass: 3,
	gviNameFeatureClass: 4,
	gviNameFieldInfo: 5,
	gviNameResource: 6,
	gviNameIndex: 7
};

/*!
 * 对该枚举的说明
 */
export const gviReplicateOperation = {
	gviReplicateInitialize: 0,
	gviReplicateFinished: 1,
	gviReplicateExtractSchema: 2,
	gviReplicateExtractData: 3,
	gviReplicateCreateSchema: 4,
	gviReplicateReplicateData: 5,
	gviReplicateCreateSpatialIndex: 6,
	gviReplicateCreateRenderIndex: 7,
	gviReplicateCommitTransaction: 8,
	gviReplicateTruncateDelta: 9,
	gviReplicateReleaseLock: 10,
	gviCloseFile: 11,
	gviWriteFile: 12,
	gviOpenFile: 13,
	gviWriteImage: 14,
	gviWriteModel: 15
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkJunctionConnectivityPolicy = {
	gviHonor: 1,
	gviOverride: 2
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkEdgeConnectivityPolicy = {
	gviAnyVertex: 1,
	gviEndVertex: 2
};

/*!
 * 对该枚举的说明
 */
export const gviConflictDetectedType = {
	gviConflictDetectedMaster: 1,
	gviConflictDetectedSlave: 2,
	gviConflictDetectedManual: 3
};

/*!
 * 对该枚举的说明
 */
export const gviReplicationType = {
	gviReplicationCheckOut: 0,
	gviReplicationCheckIn: 1
};

/*!
 * 对该枚举的说明
 */
export const gviModelLODType = {
	gviSimpleModel: 0,
	gviFineModel: 1
};

/*!
 * 对该枚举的说明
 */
export const gviNetworkSide = {
	gviSideNone: 0,
	gviSideAlongDigitized: 1,
	gviSideAgainstDigitized: 2
};


/***********************************************/
/*GcmFdeDataInterop
 /***********************************************/


/*!
 * 对该枚举的说明
 */
export const gviDataConnectionType = {
	gviOgrConnectionUnknown: 0,
	gviOgrConnectionDWG: 1,
	gviOgrConnectionShp: -2147483647,
	gviOgrConnectionSDE: -2147483646,
	gviOgrConnectionOCI: -2147483645,
	gviOgrConnectionMS: -2147483644,
	gviOgrConnectionPG: -2147483643,
	gviOgrConnectionPGEO: -2147483642,
	gviOgrConnectionWFS: -2147483641,
	gviOgrConnectionFileGDB: -2147483640,
	gviOgrConnectionSKP: -2147483639,
	gviOgrConnectionLAS: -2147483632,
	gviOgrConnectionFBX: -2147483631,
	gviOgrConnectionIFC: -2147483628
};

/*!
 * 对该枚举的说明
 */
export const gviResourceConflictPolicy = {
	gviResourceIgnore: 1,
	gviResourceUserExists: 2,
	gviResourceOverWrite: 3,
	gviResourceRenameToNew: 4
};

/*!
 * 对该枚举的说明
 */
export const gviDomainCopyPolicy = {
	gviDomainIgnor: 1,
	gviDomainCopy: 2
};

/*!
 * 对该枚举的说明
 */
export const gviRebuildRenderIndexPolicy = {
	gviRebuildNone: 1,
	gviRebuildOnlyFlag: 2,
	gviRebuildWithData: 3
};

/*!
 * 对该枚举的说明
 */
export const gviRasterConnectionType = {
	gviRasterConnectionUnknown: 0,
	gviRasterConnectionFile: 1,
	gviRasterConnectionWMS: 2,
	gviRasterConnectionOCI: 3,
	gviRasterConnectionWMTS: 4,
	gviRasterConnectionMapServer: 5
};


/***********************************************/
/*GcmFdeGeometry
 /***********************************************/


/*!
 * 对该枚举的说明
 */
export const gviGeometryType = {
	gviGeometryUnknown: 0,
	gviGeometryPoint: 1,
	gviGeometryModelPoint: 2,
	gviGeometryPOI: 4,
	gviGeometryCircularArc: 6,
	gviGeometryLine: 10,
	gviGeometryCircle: 11,
	gviGeometryPolyline: 30,
	gviGeometryRing: 31,
	gviGeometryCompoundLine: 32,
	gviGeometryPolygon: 50,
	gviGeometryTriMesh: 51,
	gviGeometryCollection: 70,
	gviGeometryMultiPoint: 71,
	gviGeometryMultiPolyline: 72,
	gviGeometryMultiPolygon: 73,
	gviGeometryMultiTrimesh: 74,
	gviGeometryClosedTriMesh: 77,
	gviGeometryPointCloud: 100
};

/*!
 * 对该枚举的说明
 */
export const gviGeometryDimension = {
	gviGeometry0Dimension: 0,
	gviGeometry1Dimension: 1,
	gviGeometry2Dimension: 2,
	gviGeometry3Dimension: 3,
	gviGeometryNoDimension: -1
};

/*!
 * 对该枚举的说明
 */
export const gviVertexAttribute = {
	gviVertexAttributeNone: 0,
	gviVertexAttributeZ: 1,
	gviVertexAttributeM: 2,
	gviVertexAttributeZM: 3,
	gviVertexAttributeID: 4,
	gviVertexAttributeZID: 5,
	gviVertexAttributeMID: 6,
	gviVertexAttributeZMID: 7
};

/*!
 * 对该枚举的说明
 */
export const gviCoordinateReferenceSystemType = {
	gviCrsProject: 1,
	gviCrsGeographic: 2,
	gviCrsVertical: 3,
	gviCrsTemporal: 4,
	gviCrsUnknown: 5,
	gviCrsENU: 6
};

/*!
 * 对该枚举的说明
 */
export const gviCurveInterpolationType = {
	gviCurveInterpolationLinear: 0,
	gviCurveInterpolationCircle: 1
};

/*!
 * 对该枚举的说明
 */
export const gviLocateStatus = {
	gviLocateOutside: 0,
	gviLocateVertex: 1,
	gviLocateEdge: 2,
	gviLocateFacet: 3
};

/*!
 * 对该枚举的说明
 */
export const gviSurfaceInterpolationType = {
	gviSurfaceInterpolationPlanar: 0,
	gviSurfaceInterpolationSpherical: 1,
	gviSurfaceInterpolationElliptical: 2,
	gviSurfaceInterpolationParametricCurve: 3
};

/*!
 * 对该枚举的说明
 */
export const gviTerrainAnalyseOperation = {
	gviTerrainGetSurfaceArea: 0,
	gviTerrainFindWaterSinkBoundary: 1,
	gviTerrainCalculateCutFill: 2
};

/*!
 * 对该枚举的说明
 */
export const gviBufferStyle = {
	gviBufferCapround: 1,
	gviBufferCapbutt: 2,
	gviBufferCapsquare: 3
};

/*!
 * 对该枚举的说明
 */
export const gviRoofType = {
	gviRoofFlat: 0,
	gviRoofHip: 1,
	gviRoofGable: 2
};


/***********************************************/
/*GcmFdeUndoRedo
 /***********************************************/


/*!
 * 对该枚举的说明
 */
export const gviCommandType = {
	gviCommandStart: 0,
	gviCommandInsert: 1,
	gviCommandDelete: 2,
	gviCommandUpdate: 3
};


/***********************************************/
/*GcmMath
 /***********************************************/



/***********************************************/
/*GcmRenderControl
 /***********************************************/


/*!
 * 对该枚举的说明
 */
export const gviRenderSystem = {
	gviRenderD3D: 0,
	gviRenderOpenGL: 1
};

/*!
 * 对该枚举的说明
 */
export const gviObjectType = {
	gviObjectNone: 0,
	gviObjectReferencePlane: 2,
	gviObjectFeatureLayer: 256,
	gviObjectTerrain: 257,
	gviObjectRenderModelPoint: 258,
	gviObjectTerrainRoute: 260,
	gviObjectRenderPolyline: 261,
	gviObjectRenderPolygon: 262,
	gviObjectRenderTriMesh: 263,
	gviObjectRenderMultiPoint: 264,
	gviObjectRenderPoint: 265,
	gviObjectCameraTour: 266,
	gviObjectMotionPath: 267,
	gviObjectSkyBox: 271,
	gviObjectParticleEffect: 272,
	gviObjectLabel: 273,
	gviObjectTableLabel: 274,
	gviObjectSkinnedMesh: 275,
	gviObjectRenderArrow: 276,
	gviObjectRenderMultiPolyline: 277,
	gviObjectRenderMultiPolygon: 278,
	gviObjectImageryLayer: 279,
	gviObjectRenderMultiTriMesh: 280,
	gviObjectTerrainHole: 281,
	gviObject3DTileLayer: 282,
	gviObjectTerrainVideo: 283,
	gviObjectOverlayLabel: 284,
	gviObjectDynamicObject: 286,
	gviObjectTerrainModifier: 287,
	gviObjectRenderPointCloud: 288,
	gviObjectRenderPOI: 289,
	gviObjectWalkGround: 290,
	gviObject3DTileHole: 291,
	gviObjectTerrainRegularPolygon: 293,
	gviObjectTerrainCylinder: 294,
	gviObjectTerrainCone: 295,
	gviObjectTerrainArrow: 296,
	gviObjectTerrain3DArrow: 297,
	gviObjectTerrainLocation: 298,
	gviObjectTerrainRectangle: 299,
	gviObjectTerrainBox: 300,
	gviObjectTerrainPyramid: 301,
	gviObjectTerrainEllipse: 302,
	gviObjectTerrainArc: 303,
	gviObjectTerrainSphere: 304,
	gviObjectPresentation: 305,
	gviObjectTerrainImageLabel: 306,
	gviObjectComplexParticleEffect: 307,
	gviObjectViewshed: 308,
	gviObjectHeatMap: 309,
	gviObjectClipPlaneOperation: 310
};

/*!
 * 对该枚举的说明
 */
export const gviMeasurementMode = {
	gviMeasureAerialDistance: 0,
	gviMeasureHorizontalDistance: 1,
	gviMeasureVerticalDistance: 2,
	gviMeasureCoordinate: 3,
	gviMeasureGroundDistance: 4,
	gviMeasureArea: 5,
	gviMeasureGroundArea: 6,
	gviMeasureGroupSightLine: 7
};

/*!
 * 对该枚举的说明
 */
export const gviClipMode = {
	gviClipCustomePlane: 0,
	gviClipBox: 1
};

/*!
 * 对该枚举的说明
 */
export const gviInteractMode = {
	gviInteractNormal: 1,
	gviInteractSelect: 2,
	gviInteractMeasurement: 3,
	gviInteractEdit: 4,
	gviInteractWalk: 5,
	gviInteractDisable: 6,
	gviInteract2DMap: 7,
	gviInteractSlide: 10,
	gviInteractClipPlane: 11
};

/*!
 * 对该枚举的说明
 */
export const gviEditorType = {
	gviEditorNone: 0,
	gviEditorMove: 1,
	gviEditorRotate: 2,
	gviEditorScale: 3,
	gviEditorZRotate: 4,
	gviEditorZScale: 5,
	gviEditorZMove: 6,
	gviEditorXYMove: 7,
	gviEditorBoxScale: 8
};

/*!
 * 对该枚举的说明
 */
export const gviMouseSelectObjectMask = {
	gviSelectNone: 0,
	gviSelectFeatureLayer: 1,
	gviSelectTerrain: 2,
	gviSelectReferencePlane: 8,
	gviSelectTerrainHole: 16,
	gviSelectTileLayer: 32,
	gviSelectLable: 64,
	gviSelectParticleEffect: 128,
	gviSelectRenderGeometry: 256,
	gviSelectSkinnedMesh: 512,
	gviSelectTileHole: 1024,
	gviSelectOverlayLabel: 2048,
	gviSelectTerrainObject: 4096,
	gviSelectAll: 65535
};

/*!
 * 对该枚举的说明
 */
export const gviMouseSelectMode = {
	gviMouseSelectClick: 1,
	gviMouseSelectDrag: 2,
	gviMouseSelectMove: 4,
	gviMouseSelectHover: 8
};

/*!
 * 对该枚举的说明
 */
export const gviSetCameraFlags = {
	gviSetCameraNoFlags: 0,
	gviSetCameraIgnoreX: 1,
	gviSetCameraIgnoreY: 2,
	gviSetCameraIgnoreZ: 4,
	gviSetCameraIgnorePosition: 7,
	gviSetCameraIgnoreYaw: 8,
	gviSetCameraIgnorePitch: 16,
	gviSetCameraIgnoreRoll: 32,
	gviSetCameraIgnoreOrientation: 56
};

/*!
 * 对该枚举的说明
 */
export const gviGetElevationType = {
	gviGetElevationFromDatabase: 0,
	gviGetElevationFromMemory: 1
};

/*!
 * 对该枚举的说明
 */
export const gviPivotAlignment = {
	gviPivotAlignBottomLeft: 0,
	gviPivotAlignBottomCenter: 1,
	gviPivotAlignBottomRight: 2,
	gviPivotAlignCenterLeft: 3,
	gviPivotAlignCenterCenter: 4,
	gviPivotAlignCenterRight: 5,
	gviPivotAlignTopLeft: 6,
	gviPivotAlignTopCenter: 7,
	gviPivotAlignTopRight: 8
};

/*!
 * 对该枚举的说明
 */
export const gviDashStyle = {
	gviDashTiny: -1717986919,
	gviDashDots: -1431655766,
	gviDashSmall: -1010580541,
	gviDashMedium: -267390961,
	gviDashLarge: -16776961,
	gviDashDot: -16678657,
	gviDashDotDot: -15978241,
	gviDashXLarge: -1044481,
	gviDashSolid: -1
};

/*!
 * 对该枚举的说明
 */
export const gviMultilineJustification = {
	gviMultilineLeft: 0,
	gviMultilineCenter: 1,
	gviMultilineRight: 2
};

/*!
 * 对该枚举的说明
 */
export const gviCameraTourMode = {
	gviCameraTourLinear: 0,
	gviCameraTourSmooth: 1,
	gviCameraTourBounce: 2
};

/*!
 * 对该枚举的说明
 */
export const gviSimplePointStyle = {
	gviSimplePointCircle: 0,
	gviSimplePointSquare: 1,
	gviSimplePointCross: 2,
	gviSimplePointX: 3,
	gviSimplePointDiamond: 4
};

/*!
 * 对该枚举的说明
 */
export const gviViewportMode = {
	gviViewportSinglePerspective: 1,
	gviViewportStereoAnaglyph: 2,
	gviViewportStereoQuadbuffer: 3,
	gviViewportL1R1: 4,
	gviViewportT1B1: 6,
	gviViewportL1M1R1: 7,
	gviViewportT1M1B1: 8,
	gviViewportL2R1: 9,
	gviViewportL1R2: 10,
	gviViewportQuad: 11,
	gviViewportPIP: 12,
	gviViewportQuadH: 13,
	gviViewportStereoDualView: 14,
	gviViewportL1R1SingleFrustum: 15,
	gviViewportT1B1SingleFrustum: 16,
	gviViewportStereoDualOculus: 17
};

/*!
 * 对该枚举的说明
 */
export const gviSkyboxImageIndex = {
	gviSkyboxImageFront: 0,
	gviSkyboxImageBack: 1,
	gviSkyboxImageLeft: 2,
	gviSkyboxImageRight: 3,
	gviSkyboxImageTop: 4,
	gviSkyboxImageBottom: 5
};

/*!
 * 对该枚举的说明
 */
export const gviGeoEditType = {
	gviGeoEditCreator: 0,
	gviGeoEdit3DMove: 1,
	gviGeoEdit3DRotate: 2,
	gviGeoEdit3DScale: 3,
	gviGeoEdit2DMove: 4,
	gviGeoEditZRotate: 5,
	gviGeoEditZScale: 6,
	gviGeoEditVertex: 7,
	gviGeoEditBoxScale: 8
};

/*!
 * 对该枚举的说明
 */
export const gviParticleBillboardType = {
	gviParticleBillboardOrientedCamera: 0,
	gviParticleBillboardOrientedMoveDirection: 1
};

/*!
 * 对该枚举的说明
 */
export const gviEmitterType = {
	gviEmitterNone: 0,
	gviEmitterPoint: 1,
	gviEmitterBox: 2,
	gviEmitterCircle: 3
};

/*!
 * 对该枚举的说明
 */
export const gviWeatherType = {
	gviWeatherSunShine: 0,
	gviWeatherLightRain: 1,
	gviWeatherModerateRain: 2,
	gviWeatherHeavyRain: 3,
	gviWeatherLightSnow: 4,
	gviWeatherModerateSnow: 5,
	gviWeatherHeavySnow: 6
};

/*!
 * 对该枚举的说明
 */
export const gviModKeyMask = {
	gviModKeyShift: 3,
	gviModKeyCtrl: 12,
	gviModKeyDblClk: 16384
};

/*!
 * 对该枚举的说明
 */
export const gviViewportMask = {
	gviViewNone: 0,
	gviView0: 1,
	gviView1: 2,
	gviView2: 4,
	gviView3: 8,
	gviViewAllNormalView: 15,
	gviViewPIP: 16
};

/*!
 * 对该枚举的说明
 */
export const gviRenderRuleType = {
	gviRenderRuleRange: 0,
	gviRenderRuleUniqueValues: 1
};

/*!
 * 对该枚举的说明
 */
export const gviHeightStyle = {
	gviHeightOnTerrain: 0,
	gviHeightAbsolute: 1,
	gviHeightRelative: 2,
	gviHeightOnEverything: 3
};

/*!
 * 对该枚举的说明
 */
export const gviFogMode = {
	gviFogNone: 0,
	gviFogExp: 1,
	gviFogExp2: 2,
	gviFogLinear: 3
};

/*!
 * 对该枚举的说明
 */
export const gviRenderType = {
	gviRenderSimple: 0,
	gviRenderValueMap: 1
};

/*!
 * 对该枚举的说明
 */
export const gviRasterSourceType = {
	gviRasterUnknown: 0,
	gviRasterSourceFile: 1,
	gviRasterSourceGeoRaster: 2,
	gviRasterSourceWMS: 3,
	gviRasterSourceWMTS: 4,
	gviRasterSourceMapServer: 5
};

/*!
 * 对该枚举的说明
 */
export const gviGeometrySymbolType = {
	gviGeoSymbolPoint: 0,
	gviGeoSymbolImagePoint: 1,
	gviGeoSymbolModelPoint: 2,
	gviGeoSymbolCurve: 3,
	gviGeoSymbolSurface: 4,
	gviGeoSymbol3DPolygon: 5,
	gviGeoSymbolSolid: 6,
	gviGeoSymbolPointCloud: 7
};

/*!
 * 对该枚举的说明
 */
export const gviFlyMode = {
	gviFlyArc: 0,
	gviFlyLinear: 1
};

/*!
 * 对该枚举的说明
 */
export const gviActionCode = {
	gviActionFlyTo: 0,
	gviActionJump: 1,
	gviActionFollowBehind: 2,
	gviActionFollowAbove: 3,
	gviActionFollowBelow: 4,
	gviActionFollowLeft: 5,
	gviActionFollowRight: 6,
	gviActionFollowBehindAndAbove: 7,
	gviActionFollowCockpit: 8
};

/*!
 * 对该枚举的说明
 */
export const gviHTMLWindowPosition = {
	gviWinPosUserDefined: 0,
	gviWinPosCenterParent: 1,
	gviWinPosCenterDesktop: 2,
	gviWinPosMousePosition: 3,
	gviWinPosParentSize: 4,
	gviWinPosParentRightTop: 5
};

/*!
 * 对该枚举的说明
 */
export const gviSunCalculateMode = {
	gviSunModeFollowCamera: 1,
	gviSunModeAccordingToGMT: 2,
	gviSunModeUserDefined: 3
};

/*!
 * 对该枚举的说明
 */
export const gviMouseSnapMode = {
	gviMouseSnapDisable: 0,
	gviMouseSnapVertex: 1
};

/*!
 * 对该枚举的说明
 */
export const gviArrowType = {
	gviArrowSingle: 0,
	gviArrowDual: 1
};

/*!
 * 对该枚举的说明
 */
export const gviCollisionDetectionMode = {
	gviCollisionDisable: 0,
	gviCollisionOnlyKeyboard: 1,
	gviCollisionEnable: 3
};

/*!
 * 对该枚举的说明
 */
export const gviAttributeMask = {
	gviAttributeHighlight: 1,
	gviAttributeCollision: 2,
	gviAttributeClipPlane: 4
};

/*!
 * 对该枚举的说明
 */
export const gviRenderControlParameters = {
	gviRenderParamMeasurementLengthUnit: 0,
	gviRenderParamMeasurementAreaUnit: 1,
	gviRenderParamLanguage: 2,
	gviRenderParamLight0Ambient: 3,
	gviRenderParamLight0Diffuse: 4,
	gviRenderParamLightModelAmbient: 5,
	gviRenderParamStereoFusionDistance: 6,
	gviRenderParamStereoEyeSeparation: 7,
	gviRenderParamStereoScreenDistance: 8,
	gviRenderParam3DWindowHeight: 9,
	gviRenderParam3DWindowWidth: 10,
	gviRenderParamOcclusionQuery: 11,
	gviRenderParamOutlineColor: 12,
	gviRenderParamAlphaTestValue: 13,
	gviRenderParamClipPlaneLineColor: 14
};

/*!
 * 对该枚举的说明
 */
export const gviManipulatorMode = {
	gviCityMakerManipulator: 0,
	gviGoogleEarthManipulator: 1
};

/*!
 * 对该枚举的说明
 */
export const gviLengthUnit = {
	gviLengthUnitMeter: 0,
	gviLengthUnitKilometer: 1,
	gviLengthUnitFoot: 2,
	gviLengthUnitMile: 3,
	gviLengthUnitSeaMile: 4
};

/*!
 * 对该枚举的说明
 */
export const gviAreaUnit = {
	gviAreaUnitSquareMeter: 0,
	gviAreaUnitSquareKilometer: 1,
	gviAreaUnitHectare: 2,
	gviAreaUnitMu: 3,
	gviAreaUnitQing: 4,
	gviAreaUnitAcre: 5,
	gviAreaUnitSquareMile: 6
};

/*!
 * 对该枚举的说明
 */
export const gviLockMode = {
	gviLockDecal: 0,
	gviLockAxis: 1,
	gviLockAxisTextUp: 2,
	gviAxisAutoPitch: 3,
	gviAxisAutoPitchTextup: 4
};

/*!
 * 对该枚举的说明
 */
export const gviDynamicMotionStyle = {
	gviDynamicMotionGroundVehicle: 0,
	gviDynamicMotionAirplane: 1,
	gviDynamicMotionHelicopter: 2,
	gviDynamicMotionHover: 3
};

/*!
 * 对该枚举的说明
 */
export const gviElevationBehaviorMode = {
	gviElevationBehaviorReplace: 0,
	gviElevationBehaviorBelow: 1,
	gviElevationBehaviorAbove: 2
};

/*!
 * 对该枚举的说明
 */
export const gviDepthTestMode = {
	gviDepthTestEnable: 0,
	gviDepthTestDisable: 1,
	gviDepthTestAdvance: 2,
	gviDepthTestGreaterEqual: 3,
	gviDepthTestGreater: 4,
	gviDepthTestLessEqual: 5,
	gviDepthTestEqual: 6,
	gviDepthTestNotEqual: 7,
	gviDepthTestAlways: 8,
	gviDepthTestAdvanceSecondDrawMaxDepth: 1000
};

/*!
 * 对该枚举的说明
 */
export const gviWalkMode = {
	gviWalkDisable: 0,
	gviWalkOnWalkGround: 1,
	gviWalkOnAll: -1
};

/*!
 * 对该枚举的说明
 */
export const gviTerrainActionCode = {
	gviFlyToTerrain: 0,
	gviJumpToTerrain: 1
};

/*!
 * 对该枚举的说明
 */
export const gviAltitudeType = {
	gviAltitudeTerrainRelative: 0,
	gviAltitudePivotRelative: 1,
	gviAltitudeOnTerrain: 2,
	gviAltitudeTerrainAbsolute: 3
};

/*!
 * 对该枚举的说明
 */
export const gviLineToGroundType = {
	gviLineTypeNone: 0,
	gviLineTypeToGround: 1,
	gviLineTypeCustom: 2
};

/*!
 * 对该枚举的说明
 */
export const gviShowTextOptions = {
	gviShowTextAlways: 0,
	gviShowTextOnHover: 1
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationPlayMode = {
	gviPresentationPlayAutomatic: 0,
	gviPresentationPlayManual: 1
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationPlaySpeed = {
	gviPresentationPlayVerySlow: 0,
	gviPresentationPlaySlow: 1,
	gviPresentationPlayNormal: 2,
	gviPresentationPlayFast: 3,
	gviPresentationPlayVeryFast: 4
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationStatus = {
	gviPresentationPlaying: 0,
	gviPresentationNotPlaying: 1,
	gviPresentationPaused: 2,
	gviPresentationWaitingTime: 3,
	gviPresentationWaitingClick: 4,
	gviPresentationBeforeSwitchingToAnotherPresentation: 5,
	gviPresentationAfterSwitchingFromAnotherPresentation: 6
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationStepContinue = {
	gviPresentationStepContinueMouseClick: 0,
	gviPresentationStepContinueWait: 1
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationStepFlightSpeed = {
	gviPresentationStepFlightVerySlow: 0,
	gviPresentationStepFlightSlow: 1,
	gviPresentationStepFlightNormal: 2,
	gviPresentationStepFlightFast: 3,
	gviPresentationStepFlightVeryFast: 4
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationSplineSpeedBehavior = {
	gviPresentationSplineSpeedAutomatic: 0,
	gviPresentationSplineSpeedManualIgnoreSpeedFactor: 1,
	gviPresentationSplineSpeedManualWithSpeedFactor: 2
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationStepType = {
	gviPresentationStepTypeLocation: 0,
	gviPresentationStepTypeDynamicObject: 1,
	gviPresentationStepTypeGroupOrObject: 2,
	gviPresentationStepTypeUnderGroundMode: 3,
	gviPresentationStepTypeTimeSlider: 4,
	gviPresentationStepTypeSetTime: 5,
	gviPresentationStepTypeMessage: 6,
	gviPresentationStepTypeTool: 7,
	gviPresentationStepTypeCaption: 8,
	gviPresentationStepTypeRestartDynamicObject: 9,
	gviPresentationStepTypeFlightSpeedFactor: 10,
	gviPresentationStepTypePlayTimeAnimation: 11,
	gviPresentationStepTypePlayAnotherPresentation: 12,
	gviPresentationStepTypeObjectControl: 13,
	gviPresentationStepTypeEnvironmentSetting: 14,
	gviPresentationStepTypeClearCaption: -1
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationCaptionPosition = {
	gviPresentationCaptionPositionTopLeft: 0,
	gviPresentationCaptionPositionTopCenter: 1,
	gviPresentationCaptionPositionTopRight: 2,
	gviPresentationCaptionPositionBottomLeft: 3,
	gviPresentationCaptionPositionBottomCenter: 4,
	gviPresentationCaptionPositionBottomRight: 5
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationCaptionSizeType = {
	gviPresentationCaptionSizeTypeFixed: 0,
	gviPresentationCaptionSizeTypeAutomaticallyAdjust: 1
};

/*!
 * 对该枚举的说明
 */
export const gviPresentationPlayAlgorithm = {
	gviPresentationPlayAlgorithmFlyTo: 0,
	gviPresentationPlayAlgorithmSpline: 1
};

/*!
 * 对该枚举的说明
 */
export const gviComplexParticleEffectType = {
	gviComplexParticleEffectUnknown: 0,
	gviComplexParticleEffectFire_0: 1000,
	gviComplexParticleEffectFire_1: 1001,
	gviComplexParticleEffectFire_2: 1002,
	gviComplexParticleEffectFire_3: 1003,
	gviComplexParticleEffectFire_4: 1004,
	gviComplexParticleEffectSmoke_0: 2000,
	gviComplexParticleEffectSmoke_1: 2001,
	gviComplexParticleEffectSmoke_2: 2002,
	gviComplexParticleEffectExplosion_0: 3000,
	gviComplexParticleEffectExplosion_1: 3001,
	gviComplexParticleEffectExplosion_2: 3002,
	gviComplexParticleEffectExplosion_3: 3003,
	gviComplexParticleEffectExplosion_4: 3004,
	gviComplexParticleEffectExplosion_5: 3005,
	gviComplexParticleEffectExplosion_6: 3006,
	gviComplexParticleEffectExplosion_7: 3007,
	gviComplexParticleEffectExplosion_8: 3008,
	gviComplexParticleEffectRocketTailFlame: 9000
};

/*!
 * 对该枚举的说明
 */
export const gviMsgChainFlags = {
	gviMsgChainLButtonDown: 1,
	gviMsgChainLButtonUp: 2,
	gviMsgChainLButtonDblClk: 4,
	gviMsgChainMButtonDown: 8,
	gviMsgChainMButtonUp: 16,
	gviMsgChainMButtonDblClk: 32,
	gviMsgChainRButtonDown: 64,
	gviMsgChainRButtonUp: 128,
	gviMsgChainRButtonDblClk: 256,
	gviMsgChainMouseMove: 512,
	gviMsgChainMouseHover: 1024,
	gviMsgChainMouseWheel: 2048,
	gviMsgChainKeyDown: 4096,
	gviMsgChainKeyUp: 8192
};

/*!
 * 对该枚举的说明
 */
export const gviUIWindowType = {
	gviUIUnknown: 0,
	gviUIImageButton: 1,
	gviUIButton: 2
};

/*!
 * 对该枚举的说明
 */
export const gviUIEventType = {
	gviUIMouseMove: -17,
	gviUIMouseButtonDoubleClick: -16,
	gviUIMouseButtonUp: -15,
	gviUIMouseButtonDown: -14,
	gviUIMouseLeavesArea: -13,
	gviUIMouseEntersArea: -12,
	gviUIMouseClick: -11,
	gviUINone: -1
};

/*!
 * 对该枚举的说明
 */
export const gviUIMouseButtonType = {
	gviUILeftButton: 0,
	gviUIRightButton: 1,
	gviUIMiddleButton: 2,
	gviUIX1Button: 3,
	gviUIX2Button: 4,
	gviUIMouseButtonCount: 5,
	gviUINoButton: 6
};


/***********************************************/
/*GcmResource
 /***********************************************/


/*!
 * 对该枚举的说明
 */
export const gviImageType = {
	gviImageStatic: 0,
	gviImageDynamic: 1,
	gviImageCube: 2
};

/*!
 * 对该枚举的说明
 */
export const gviImageFormat = {
	gviImageUnknown: 0,
	gviImageDDS: 1,
	gviImagePNG: 2,
	gviImageJPG: 3,
	gviImagePVR: 4
};

/*!
 * 对该枚举的说明
 */
export const gviTextureWrapMode = {
	gviTextureWrapRepeat: 0,
	gviTextureWrapClampToEdge: 1
};

/*!
 * 对该枚举的说明
 */
export const gviCullFaceMode = {
	gviCullNone: 0,
	gviCullBack: 1,
	gviCullFront: 2
};

/*!
 * 对该枚举的说明
 */
export const gviPrimitiveType = {
	gviPrimitiveNormal: 0,
	gviPrimitiveBillboardZ: 1,
	gviPrimitiveWater: 2,
	gviPrimitiveGlass: 3,
	gviPrimitive3DTree: 4,
	gviPrimitiveNone: 5
};

/*!
 * 对该枚举的说明
 */
export const gviPrimitiveMode = {
	gviPrimitiveModeTriangleList: 0,
	gviPrimitiveModeLineList: 1,
	gviPrimitiveModePointList: 2,
	gviPrimitiveModeNone: 3
};

/*!
 * 对该枚举的说明
 */
export const gviModelType = {
	gviModelStatic: 1,
	gviModelSkinning: 2
};
