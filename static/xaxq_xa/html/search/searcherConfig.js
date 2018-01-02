var configData =[
    {
        "id": 4,
        "name": "造林一区倾斜数据",
        "type": "polygon",
        "position": "409161.83053698234,4314220.6223391844,56896.521312610217,-0.12546119891914032,-45.0,0",
        // cep 中对应的 图层
        "layersInCep": [
            //"FDB测试倾斜格网\\倾斜格网",
            "总装\\倾斜数据\\造林一区"
        ], //
        "connectStrArray": [
            // "ConnType=CMS7HTTP; Server=192.168.3.95; Port=8040; DataBase=FDB测试倾斜格网;FeatureDataset=倾斜格网;FeatureClass=倾斜分区",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB交通枢纽区房屋围墙单体化数据;FeatureDataset=房屋围墙单体化数据;FeatureClass=交通枢纽_房屋",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB植树造林村庄;FeatureDataset=植树造林村庄;FeatureClass=fw_xingzheng",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB植树造林单体化;FeatureDataset=植树造林房屋单体化;FeatureClass=房屋"



        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 4,
        "name": "容城县",
        "type": "OSGB",
        "position": "401482.215,4323482.1447.830,-0.125461,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\容城县",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 5,
        "name": "安新县",
        "type": "OSGB",
        "position": "406898.99,4309696.216,1484.197,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\安新县",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 5,
        "name": "雄县",
        "type": "OSGB",
        "position": "406898.998,4309696.216,1484.197,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\雄县",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 6,
        "name": "大阳村",
        "type": "OSGB",
        "position": "411495.466,4317895.786,651.4457,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\大阳村",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 3,
        "name": "起步区倾斜",
        "type": "OSGB",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\起步区倾斜",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 7,
        "name": "B6",
        "type": "OSGB",
        "position": "417416.059,4314507.829,7460.683,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\起步区倾斜\\造林一区\\B6",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 8,
        "name": "G4",
        "type": "OSGB",
        "position": "417416.059,4314507.829,7460.683,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\起步区倾斜\\造林一区\\G4",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 9,
        "name": "G6",
        "type": "OSGB",
        "position": "417416.059,4314507.829,7460.683,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\起步区倾斜\\造林一区\\G6",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 10,
        "name": "G5",
        "type": "OSGB",
        "position": "417416.059,4314507.829,7460.683,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\起步区倾斜\\造林一区\\G5",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "B5",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 11,
        "name": "B5",
        "type": "OSGB",
        "position": "417416.059,4314507.829,7460.683,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\倾斜数据\\起步区倾斜\\造林一区\\B5",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 12,
        "name": "新区范围",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\行政界线\\新区范围",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=新区范围;FeatureDataset=新区范围;FeatureClass=新区范围",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 13,
        "name": "新区五县",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\行政界线\\新区五县\\二调数据_行政边界五县",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=新区五县;FeatureDataset=新区五县;FeatureClass=二调数据_行政边界五县",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 14,
        "name": "乡镇",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\行政界线\\乡镇界线\\乡镇界线\\乡镇",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB乡镇界线3;FeatureDataset=乡镇界线3;FeatureClass=乡镇",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 15,
        "name": "乡镇界线",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\行政界线\\乡镇界线\\乡镇界线\\乡镇界线",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB乡镇界线2;FeatureDataset=乡镇界线2;FeatureClass=乡镇范围",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 16,
        "name": "行政村",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\行政界线\\村庄范围\\村庄范围\\行政村",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB村庄范围2;FeatureDataset=村庄范围;FeatureClass=行政村",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 17,
        "name": "POI兴趣点",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\POI兴趣点\\高德POI",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=政府机构及社会团体",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=餐饮服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=住宿服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=道路附属设施",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=通行设施",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=汽车服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=公共设施",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=科教文化服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=地名地址信息",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=摩托车服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=汽车销售",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=购物服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=风景名胜",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=交通设施服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=商务住宅",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=汽车维修",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=金融保险服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=生活服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=体育休闲服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=公司企业",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB高德POI2;FeatureDataset=POI;FeatureClass=医疗保健服务",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB各级政府;FeatureDataset=各级政府;FeatureClass=村委会",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB各级政府;FeatureDataset=各级政府;FeatureClass=区县级政府",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB各级政府;FeatureDataset=各级政府;FeatureClass=乡镇级政府",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
        ],
        // 关键字 对应的字段
        "keyField": "name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 18,
        "name": "省道",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\交通\\公路\\省道",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=矢量FDB;FeatureDataset=京津冀公路;FeatureClass=JJJTwoRoad_ln-gk117e"
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 19,
        "name": "高速公路",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\交通\\公路\\高速公路",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=矢量FDB;FeatureDataset=京津冀公路;FeatureClass=JJJOneRoad-gk117e",
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 20,
        "name": "雄安路网",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\交通\\公路\\雄安路网",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=矢量FDB;FeatureDataset=雄安路网;FeatureClass=xalw-gk117e",
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 21,
        "name": "铁路",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\交通\\铁路",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=矢量FDB;FeatureDataset=京津冀铁路;FeatureClass=JJJRailwayA-gk117e",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 22,
        "name": "水系",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\交通\\水系",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=矢量FDB;FeatureDataset=水系;FeatureClass=水系",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划09075;FeatureDataset=地块;FeatureClass=水域",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 23,
        "name": "居民地",
        "type": "shapefile",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\居民地",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 24,
        "name": "全区地质三维模型",
        "type": "DGN",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\地质数据\\全区地质三维模型",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=地质模型;FeatureDataset=地层单元配色+图例+岩性花纹材质_dgn_i;FeatureClass=DZ-DC",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 24,
        "name": "钻孔模型",
        "type": "DGN",
        "position": "410687.389,4265737.628,38646.2896,0.83451194,-40,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\地质数据\\钻孔模型\\全区虚拟钻孔",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=钻孔fdb0911;FeatureDataset=钻孔;FeatureClass=DZ-ZK",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 25,
        "name": "预估埋深10m砂土液化分布图",
        "type": "DGN",
        "position": "427923.9295,4310185.914,67335.5768,-1.0197536127336093,-89.9999996,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\地质数据\\钻孔模型\\地质专题\\预估埋深10m砂土液化分布图",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划09075;FeatureDataset=地块;FeatureClass=预估埋深10m区砂土野花分布图",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 26,
        "name": "软弱土分布图",
        "type": "shapefile",
        "position": "427923.9295,4310185.914,67335.5768,-1.0197536127336093,-89.9999996,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\地质数据\\钻孔模型\\地质专题\\预估埋深10m砂土液化分布图",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划09075;FeatureDataset=地块;FeatureClass=软弱土分布图",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 27,
        "name": "地热资源",
        "type": "shapefile",
        "position": "427923.9295,4310185.914,67335.5768,-1.0197536127336093,-89.9999996,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\地质数据\\钻孔模型\\地质专题\\地热资源",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划09075;FeatureDataset=地块;FeatureClass=地热资源t",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 28,
        "name": "现状砂土液化分布图斜",
        "type": "shapefile",
        "position": "427923.9295,4310185.914,67335.5768,-1.0197536127336093,-89.9999996,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\地质数据\\钻孔模型\\地质专题\\现状砂土液化分布图",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划09075;FeatureDataset=地块;FeatureClass=现状砂土液化分布图",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 29,
        "name": "场地稳定性分区图",
        "type": "shapefile",
        "position": "427923.9295,4310185.914,67335.5768,-1.0197536127336093,-89.9999996,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\地质数据\\钻孔模型\\地质专题\\场地稳定性分区图",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划09075;FeatureDataset=地块;FeatureClass=场地稳定性分区图",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 30,
        "name": "场地适宜性",
        "type": "shapefile",
        "position": "427923.9295,4310185.914,67335.5768,-1.0197536127336093,-89.9999996,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\地理数据\\地质数据\\钻孔模型\\地质专题\\场地适宜性",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划09075;FeatureDataset=地块;FeatureClass=场地适宜性",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 31,
        "name": "建设用地控制边界",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\各级范围\\建设用地控制边界",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=周边城镇范围;FeatureDataset=周边城镇范围;FeatureClass=建设用地控制边界",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 32,
        "name": "城镇建设用地控制界限",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\各级范围\\城镇建设用地控制界限",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=周边城镇范围;FeatureDataset=周边城镇范围;FeatureClass=城镇建设用地控制界限",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 33,
        "name": "协调区范围",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\各级范围\\协调区范围",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=周边城镇范围;FeatureDataset=周边城镇范围;FeatureClass=协调区范围",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 34,
        "name": "新区范围",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\各级范围\\新区范围",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=周边城镇范围;FeatureDataset=周边城镇范围;FeatureClass=新区范围",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 35,
        "name": "起步区范围",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\各级范围\\新区范围",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=周边城镇范围;FeatureDataset=周边城镇范围;FeatureClass=起步区范围",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 36,
        "name": "周边县大范围",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\各级范围\\周边县大范围",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=周边城镇范围;FeatureDataset=周边城镇范围;FeatureClass=周边县大范围",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 37,
        "name": "06总规城镇开发边界-线",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\各级范围\\总规城镇开发边界\\06总规城镇开发边界-线",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=总规城镇开发边界;FeatureClass=06总规城镇开发边界-线",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 38,
        "name": "06总规城镇开发边界-面",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\各级范围\\总规城镇开发边界\\06总规城镇开发边界-面",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=总规城镇开发边界;FeatureClass=06总规城镇开发边界-面",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 39,
        "name": "绿地系统",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\各级范围\\总规城镇开发边界\\绿地系统",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=绿地系统;FeatureDataset=绿地系统;FeatureClass=绿地系统",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 40,
        "name": "规划地块",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\总体规划\\规划地块",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划09075;FeatureDataset=地块;FeatureClass=规划地块",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 41,
        "name": "总规用地",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\总体规划\\总规用地",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 42,
        "name": "起步区用地",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\总体规划\\起步区用地",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=起步区用地;FeatureClass=14起步区用地_面",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 43,
        "name": "现状村庄",
        "type":"shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\总体规划\\美丽乡村\\起步区用地",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=美丽乡村;FeatureDataset=美丽乡村;FeatureClass=现状村庄",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 44,
        "name": "规划农村居民点",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\总体规划\\美丽乡村\\规划农村居民点",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=美丽乡村;FeatureDataset=美丽乡村;FeatureClass=规划农村居民点",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 45,
        "name": "社区生活圈",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\总体规划\\美丽乡村\\社区生活圈",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=美丽乡村;FeatureDataset=美丽乡村;FeatureClass=社区生活圈",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 46,
        "name": "新型社区",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\总体规划\\美丽乡村\\新型社区",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=美丽乡村;FeatureDataset=美丽乡村;FeatureClass=新型社区",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 47,
        "name": "建筑限高",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\总体规划\\建筑限高",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=1 高程;FeatureDataset=04高程;FeatureClass=04高程",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 48,
        "name": "规划道路",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\规划道路",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划09075;FeatureDataset=地块;FeatureClass=规划道路",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 49,
        "name": "高速公路",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高速公路和城市道路\\高速公路",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高速公路和城市道路体系;FeatureDataset=高速公路和城市道路;FeatureClass=高速公路",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 50,
        "name": "起步区倾斜",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高速公路和城市道路\\主干道",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高速公路和城市道路体系;FeatureDataset=高速公路和城市道路;FeatureClass=主干道",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 51,
        "name": "主干道",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高速公路和城市道路\\主干道",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高速公路和城市道路体系;FeatureDataset=高速公路和城市道路;FeatureClass=主干道",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 52,
        "name": "支路",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高速公路和城市道路\\支路",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高速公路和城市道路体系;FeatureDataset=高速公路和城市道路;FeatureClass=支路",
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 53,
        "name": "公园路",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高速公路和城市道路\\公园路",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB房屋单体化;FeatureDataset=房屋单体化;FeatureClass=Building",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 54,
        "name": "城际铁路",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\城际铁路",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=城际铁路",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 55,
        "name": "规划高速铁路站点",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\规划高速铁路站点",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=规划高速铁路站点",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 56,
        "name": "规划城市轨道",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\规划城市轨道",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=规划城市轨道",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 57,
        "name": "市域轨道交通站点",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\市域轨道交通站点",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=市域轨道交通站点",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 58,
        "name": "普通铁路",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\普通铁路",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=普通铁路",
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 59,
        "name": "市域快线（预留）",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\市域快线（预留）",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=市域快线（预留）",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 60,
        "name": "高速铁路",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\高速铁路",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=高速铁路",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 61,
        "name": "轨道快线",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\轨道快线",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=轨道快线",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 62,
        "name": "轨道快线站点",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\轨道快线站点",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=轨道快线站点",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 63,
        "name": "轨道普线站点",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\轨道普线站点",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=轨道普线站点",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 64,
        "name": "轨道换乘站点",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\轨道换乘站点",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=轨道换乘站点",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 65,
        "name": "组团综合交通枢纽",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\道路交通相关专项规划\\高铁和轨道交通系统\\组团综合交通枢纽",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=高铁和轨道交通系统;FeatureDataset=高铁和轨道交通系统;FeatureClass=组团综合交通枢纽",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 64,
        "name": "水资源利用",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\水资源保障专题研究\\水资源保障专题研究",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=新城绿化",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=7水库",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=淀区绿带",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=输水工程",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=新建工程",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=淀区",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=8条进河",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=2条出河",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=调水工程",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水资源利用;FeatureDataset=水资源利用;FeatureClass=水系连通工程",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 65,
        "name": "水系面",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\水资源保障专题研究\\水系面",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=水系面;FeatureDataset=水系面;FeatureClass=水系面",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 66,
        "name": "起步区综合防灾专项规划",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\起步区综合防灾专项规划",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=防灾规划;FeatureDataset=防灾规划;FeatureClass=应急能源中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=防灾规划;FeatureDataset=防灾规划;FeatureClass=应急指挥中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=防灾规划;FeatureDataset=防灾规划;FeatureClass=一级防灾分区",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=防灾规划;FeatureDataset=防灾规划;FeatureClass=消防培训基地",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=防灾规划;FeatureDataset=防灾规划;FeatureClass=应急水厂",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=防灾规划;FeatureDataset=防灾规划;FeatureClass=消防站",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=防灾规划;FeatureDataset=防灾规划;FeatureClass=市级中心避难场所",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 67,
        "name": "地下分区与地下物流",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\地下分区与地下物流",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 68,
        "name": "地下道路物流通道",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\地下分区与地下物流\\地下道路物流通道",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=地下分区与地下物流;FeatureClass=01地下分区-面",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=地下分区与地下物流;FeatureClass=02地下货运-线",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=地下分区与地下物流;FeatureClass=03地下物流系统-线",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 68,
        "name": "海绵城市",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\海绵城市",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=海绵城市;FeatureClass=12海绵城市_point",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 69,
        "name": "地热利用专题",
        "type": "shapefile",
        "position": "403645.59988,4310473.6752806,7393.3196165,-0.12546119891914032,-39.999999999999979,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\规划数据\\专项规划\\地热利用专题",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=地热利用专题;FeatureClass=07地热利用专题·_点",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=地热利用专题;FeatureClass=07地热利用专题_线",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 70,
        "name": "市民服务中心",
        "type": "revit",
        "position": "405412.61211687454,4324141.53690,205.81866,-0.290932670,-38.9471777447,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\项目数据\\市民服务中心\\中国建筑设计院",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-OFFICE-PD-M_rvt;FeatureClass=喷头",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-OFFICE-PD-M_rvt;FeatureClass=管件",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-OFFICE-PD-M_rvt;FeatureClass=管道附件",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-OFFICE-PD-M_rvt;FeatureClass=电气设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-OFFICE-PD-M_rvt;FeatureClass=机械设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-OFFICE-PD-M_rvt;FeatureClass=管道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=17348-雄安起步区-CD-OFFICE-AS-M-Center-场地_rvt;FeatureClass=楼板",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=17348-雄安起步区-CD-OFFICE-AS-M-Center-场地_rvt;FeatureClass=线",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=17348-雄安起步区-CD-OFFICE-AS-M-Center-场地_rvt;FeatureClass=_房间分隔_",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=企业办公楼酒店公寓A-G_rvt;FeatureClass=火警设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=企业办公楼酒店公寓A-G_rvt;FeatureClass=电气设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=企业办公楼酒店公寓A-G_rvt;FeatureClass=电缆桥架配件",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=企业办公楼酒店公寓A-G_rvt;FeatureClass=灯具",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=企业办公楼酒店公寓A-G_rvt;FeatureClass=电话设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=企业办公楼酒店公寓A-G_rvt;FeatureClass=常规模型",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=企业办公楼酒店公寓A-G_rvt;FeatureClass=数据设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=企业办公楼酒店公寓A-G_rvt;FeatureClass=安全设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=企业办公楼酒店公寓A-G_rvt;FeatureClass=电缆桥架",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-BASE-PD-Center_rvt;FeatureClass=机械设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-BASE-PD-Center_rvt;FeatureClass=管件",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-BASE-PD-Center_rvt;FeatureClass=管道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-BASE-PD-Center_rvt;FeatureClass=喷头",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=17348-雄安起步区-CD-BASE-ELE-Center-分离_rvt;FeatureClass=电缆桥架配件",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=17348-雄安起步区-CD-BASE-ELE-Center-分离_rvt;FeatureClass=火警设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=17348-雄安起步区-CD-BASE-ELE-Center-分离_rvt;FeatureClass=电气装置",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=17348-雄安起步区-CD-BASE-ELE-Center-分离_rvt;FeatureClass=电缆桥架",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=17348-雄安起步区-CD-BASE-ELE-Center-分离_rvt;FeatureClass=照明设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=17348-雄安起步区-CD-BASE-ELE-Center-分离_rvt;FeatureClass=灯具",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=电气装置",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=风管管件",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=机械设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=风道末端",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=风管",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=照明设备",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=风管附件",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=管件",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=管道附件",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=管道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB建筑第三办公区;FeatureDataset=雄安起步区-CD-C楼-MEP(1)_rvt;FeatureClass=喷头",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地面道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=区域物流枢纽",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=地下道路物流通道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=规划数据;FeatureDataset=城市物流配送;FeatureClass=城市配送中心",

         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 71,
        "name": "市民服务中心地质三维模型1021（补充钻孔）",
        "type": "DGN",
        "position": "405412.61211687454,4324141.53690,205.81866,-0.290932670,-38.9471777447,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\项目数据\\市民服务中心\\中国建筑设计院市民服务中心",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=①粘土",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=②粉土",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=②-1粉质粘土",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=③粉土",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=③-1粉质粘土",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=③-2粉砂",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=④粉质粘土",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=④-1粉土",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=⑤粉砂",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=⑤-1中砂",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=⑥粉质粘土",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=DZ-ZK",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=市民服务中心地质三维模型;FeatureDataset=市民服务中心地质三维模型1021（补充钻孔）;FeatureClass=DZ-DX",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 72,
        "name": "植树造林（绿）",
        "type": "",
        "position": "415957.56990,4313597.0,2098.2864,10.19038906,-25.66774575,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\项目数据\\植树造林\\植树造林（绿）",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=2标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=10标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=6标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=9标段树木",    
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=11标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=4标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=1标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=5标段树木",    
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=8标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=13标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=3标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=12标段树木", 
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=7标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=14标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终版FDB;FeatureDataset=植树造林;FeatureClass=15标段树木", 
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 73,
        "name": "植树造林(花）",
        "type": "",
        "position": "415957.56990,4313597.0,2098.2864,10.19038906,-25.66774575,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\项目数据\\植树造林\\植树造林(花）",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=8标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=4标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=1标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=5标段树木",    
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=6标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=9标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=14标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=2标段树木",    
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=12标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=7标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=11标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=3标段树木", 
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=10标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=15标段树木",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林终板;FeatureDataset=植树造林;FeatureClass=13标段树木", 
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 74,
        "name": "植树造林规划数据",
        "type": "shapefile",
        "position": "415957.56990,4313597.0,2098.2864,10.19038906,-25.66774575,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\项目数据\\植树造林\\植树造林规划数据\\植树造林规划数据",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林规划数据;FeatureDataset=植树造林规划数据;FeatureClass=9号地块",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林规划数据;FeatureDataset=植树造林规划数据;FeatureClass=水系面",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林规划数据;FeatureDataset=植树造林规划数据;FeatureClass=地势",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林规划数据;FeatureDataset=植树造林规划数据;FeatureClass=功能分区",    
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林规划数据;FeatureDataset=植树造林规划数据;FeatureClass=坑塘",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林规划数据;FeatureDataset=植树造林规划数据;FeatureClass=地下水位",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林规划数据;FeatureDataset=植树造林规划数据;FeatureClass=通风廊道",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林规划数据;FeatureDataset=植树造林规划数据;FeatureClass=居民地",    
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=植树造林规划数据;FeatureDataset=植树造林规划数据;FeatureClass=道路",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=道路中心线;FeatureDataset=植树造林规划数据;FeatureClass=道路中心线",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }, {
        "id": 75,
        "name": "电力线",
        "type": "shapefile",
        "position": "415957.56990,4313597.0,2098.2864,10.19038906,-25.66774575,0",
        // cep 中对应的 图层
        "layersInCep": [
            "总装\\项目数据\\植树造林\\电力线",
        ], //
        "connectStrArray": [
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB电力线;FeatureDataset=电线;FeatureClass=输电线_点",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB电力线;FeatureDataset=电线;FeatureClass=输电线_线",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB电力线;FeatureDataset=电线;FeatureClass=通信线_点",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB电力线;FeatureDataset=电线;FeatureClass=电线塔_线",    
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB电力线;FeatureDataset=电线;FeatureClass=通信线_线",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB电力线;FeatureDataset=电线;FeatureClass=通信线_线",
            "ConnType=CMS7HTTP; Server=192.168.3.94; Port=8040; DataBase=FDB电力线;FeatureDataset=电线;FeatureClass=电线塔",
         
        ],
        // 显示的字段
        "fields": [
            "oid",
            "name",
            "type"
        ],
        // 关键字 对应的字段
        "keyField": "Name",
        // 空间列字段
        "geoField": "Geometry"
    }
];
       