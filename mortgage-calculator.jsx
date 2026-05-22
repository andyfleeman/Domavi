const { useState, useMemo, useRef, useEffect } = React;



// ── Full county tax lookup (Tax Foundation 2024 effective rates) ─────────────
const TAX_DATA = {"Alabama":{"Autauga County":0.28,"Baldwin County":0.29,"Barbour County":0.31,"Bibb County":0.2,"Blount County":0.27,"Bullock County":0.32,"Butler County":0.26,"Calhoun County":0.33,"Chambers County":0.29,"Cherokee County":0.32,"Chilton County":0.32,"Choctaw County":0.18,"Clarke County":0.28,"Clay County":0.2,"Cleburne County":0.24,"Coffee County":0.3,"Colbert County":0.3,"Conecuh County":0.25,"Coosa County":0.2,"Covington County":0.2,"Crenshaw County":0.28,"Cullman County":0.21,"Dale County":0.28,"Dallas County":0.36,"DeKalb County":0.24,"Elmore County":0.25,"Escambia County":0.27,"Etowah County":0.32,"Fayette County":0.21,"Franklin County":0.33,"Geneva County":0.24,"Greene County":0.24,"Hale County":0.19,"Henry County":0.25,"Houston County":0.29,"Jackson County":0.25,"Jefferson County":0.58,"Lamar County":0.24,"Lauderdale County":0.32,"Lawrence County":0.25,"Lee County":0.39,"Limestone County":0.32,"Lowndes County":0.31,"Macon County":0.41,"Madison County":0.39,"Marengo County":0.31,"Marion County":0.24,"Marshall County":0.3,"Mobile County":0.43,"Monroe County":0.21,"Montgomery County":0.36,"Morgan County":0.31,"Perry County":0.23,"Pickens County":0.21,"Pike County":0.24,"Randolph County":0.27,"Russell County":0.38,"St. Clair County":0.28,"Shelby County":0.42,"Sumter County":0.28,"Talladega County":0.29,"Tallapoosa County":0.24,"Tuscaloosa County":0.31,"Walker County":0.23,"Washington County":0.23,"Wilcox County":0.25,"Winston County":0.21},"Alaska":{"Aleutians West Census Area":0.7,"Anchorage Municipality":1.17,"Bristol Bay Borough":0.44,"Chugach Census Area":0.91,"Copper River Census Area":0.04,"Denali Borough":0.14,"Dillingham Census Area":0.46,"Fairbanks North Star Borough":1.11,"Haines Borough":0.69,"Hoonah-Angoon Census Area":0.03,"Juneau City and Borough":0.88,"Kenai Peninsula Borough":0.54,"Ketchikan Gateway Borough":0.66,"Kodiak Island Borough":0.7,"Kusilvak Census Area":0.01,"Matanuska-Susitna Borough":0.9,"Nome Census Area":0.46,"North Slope Borough":0.49,"Northwest Arctic Borough":0.0,"Petersburg Borough":0.55,"Prince of Wales-Hyder Census Area":0.09,"Sitka City and Borough":0.37,"Skagway Municipality":0.41,"Wrangell City and Borough":0.45,"Yakutat City and Borough":0.35,"Yukon-Koyukuk Census Area":0.06},"Arizona":{"Apache County":0.21,"Cochise County":0.61,"Coconino County":0.39,"Gila County":0.55,"Graham County":0.47,"Greenlee County":0.28,"La Paz County":0.47,"Maricopa County":0.44,"Mohave County":0.43,"Navajo County":0.39,"Pima County":0.7,"Pinal County":0.5,"Santa Cruz County":0.62,"Yavapai County":0.4,"Yuma County":0.61},"Arkansas":{"Arkansas County":0.56,"Ashley County":0.53,"Baxter County":0.47,"Benton County":0.57,"Boone County":0.52,"Bradley County":0.53,"Calhoun County":0.39,"Carroll County":0.52,"Chicot County":0.54,"Clark County":0.46,"Clay County":0.46,"Cleburne County":0.47,"Cleveland County":0.54,"Columbia County":0.46,"Conway County":0.54,"Craighead County":0.54,"Crawford County":0.53,"Crittenden County":0.67,"Cross County":0.57,"Dallas County":0.51,"Desha County":0.59,"Drew County":0.52,"Faulkner County":0.53,"Franklin County":0.54,"Fulton County":0.45,"Garland County":0.48,"Grant County":0.52,"Greene County":0.46,"Hempstead County":0.48,"Hot Spring County":0.58,"Howard County":0.46,"Independence County":0.51,"Izard County":0.51,"Jackson County":0.5,"Jefferson County":0.63,"Johnson County":0.51,"Lafayette County":0.39,"Lawrence County":0.32,"Lee County":0.24,"Lincoln County":0.52,"Little River County":0.47,"Logan County":0.48,"Lonoke County":0.57,"Madison County":0.32,"Marion County":0.49,"Miller County":0.57,"Mississippi County":0.47,"Monroe County":0.14,"Montgomery County":0.32,"Nevada County":0.45,"Newton County":0.46,"Ouachita County":0.33,"Perry County":0.41,"Phillips County":0.76,"Pike County":0.6,"Poinsett County":0.53,"Polk County":0.35,"Pope County":0.52,"Prairie County":0.57,"Pulaski County":0.75,"Randolph County":0.42,"St. Francis County":0.48,"Saline County":0.59,"Scott County":0.37,"Searcy County":0.43,"Sebastian County":0.62,"Sevier County":0.45,"Sharp County":0.5,"Stone County":0.35,"Union County":0.57,"Van Buren County":0.45,"Washington County":0.55,"White County":0.47,"Woodruff County":0.48,"Yell County":0.38},"California":{"Alameda County":0.76,"Alpine County":0.55,"Amador County":0.7,"Butte County":0.71,"Calaveras County":0.71,"Colusa County":0.67,"Contra Costa County":0.78,"Del Norte County":0.49,"El Dorado County":0.72,"Fresno County":0.76,"Glenn County":0.61,"Humboldt County":0.62,"Imperial County":0.83,"Inyo County":0.59,"Kern County":0.89,"Kings County":0.75,"Lake County":0.72,"Lassen County":0.8,"Los Angeles County":0.67,"Madera County":0.69,"Marin County":0.77,"Mariposa County":0.58,"Mendocino County":0.67,"Merced County":0.67,"Modoc County":0.68,"Mono County":0.7,"Monterey County":0.63,"Napa County":0.6,"Nevada County":0.73,"Orange County":0.64,"Placer County":0.79,"Plumas County":0.69,"Riverside County":0.83,"Sacramento County":0.76,"San Benito County":0.79,"San Bernardino County":0.73,"San Diego County":0.67,"San Francisco County":0.72,"San Joaquin County":0.79,"San Luis Obispo County":0.64,"San Mateo County":0.63,"Santa Barbara County":0.59,"Santa Clara County":0.68,"Santa Cruz County":0.6,"Shasta County":0.7,"Sierra County":0.62,"Siskiyou County":0.6,"Solano County":0.78,"Sonoma County":0.65,"Stanislaus County":0.73,"Sutter County":0.78,"Tehama County":0.65,"Trinity County":0.26,"Tulare County":0.69,"Tuolumne County":0.62,"Ventura County":0.69,"Yolo County":0.79,"Yuba County":0.77},"Colorado":{"Adams County":0.66,"Alamosa County":0.45,"Arapahoe County":0.55,"Archuleta County":0.33,"Baca County":0.4,"Bent County":0.41,"Boulder County":0.52,"Broomfield County":0.66,"Chaffee County":0.29,"Cheyenne County":0.41,"Clear Creek County":0.4,"Conejos County":0.44,"Costilla County":0.31,"Crowley County":0.32,"Custer County":0.35,"Delta County":0.34,"Denver County":0.47,"Dolores County":0.39,"Douglas County":0.57,"Eagle County":0.36,"Elbert County":0.47,"El Paso County":0.45,"Fremont County":0.36,"Garfield County":0.39,"Gilpin County":0.37,"Grand County":0.3,"Gunnison County":0.31,"Hinsdale County":0.36,"Huerfano County":0.31,"Jackson County":0.22,"Jefferson County":0.53,"Kiowa County":0.63,"Kit Carson County":0.48,"Lake County":0.64,"La Plata County":0.27,"Larimer County":0.52,"Las Animas County":0.27,"Lincoln County":0.46,"Logan County":0.45,"Mesa County":0.38,"Mineral County":0.33,"Moffat County":0.52,"Montezuma County":0.29,"Montrose County":0.36,"Morgan County":0.52,"Otero County":0.37,"Ouray County":0.24,"Park County":0.39,"Phillips County":0.5,"Pitkin County":0.34,"Prowers County":0.34,"Pueblo County":0.52,"Rio Blanco County":0.33,"Rio Grande County":0.44,"Routt County":0.28,"Saguache County":0.43,"San Juan County":0.29,"San Miguel County":0.27,"Sedgwick County":0.52,"Summit County":0.32,"Teller County":0.35,"Washington County":0.42,"Weld County":0.55,"Yuma County":0.53},"Connecticut":{"Capitol Planning Region":1.91,"Greater Bridgeport Planning Region":1.65,"Lower Connecticut River Valley Planning Region":1.51,"Naugatuck Valley Planning Region":1.71,"Northeastern Connecticut Planning Region":1.37,"Northwest Hills Planning Region":1.35,"South Central Connecticut Planning Region":1.82,"Southeastern Connecticut Planning Region":1.56,"Western Connecticut Planning Region":1.17},"Delaware":{"Kent County":0.43,"New Castle County":0.72,"Sussex County":0.31},"District of Columbia":{"District of Columbia":0.6},"Florida":{"Alachua County":0.99,"Baker County":0.88,"Bay County":0.59,"Bradford County":0.54,"Brevard County":0.68,"Broward County":0.96,"Calhoun County":0.59,"Charlotte County":0.84,"Citrus County":0.63,"Clay County":0.77,"Collier County":0.59,"Columbia County":0.73,"DeSoto County":0.72,"Dixie County":0.6,"Duval County":0.75,"Escambia County":0.63,"Flagler County":0.76,"Franklin County":0.55,"Gadsden County":0.53,"Gilchrist County":0.61,"Glades County":0.64,"Gulf County":0.47,"Hamilton County":0.48,"Hardee County":0.66,"Hendry County":0.86,"Hernando County":0.71,"Highlands County":0.69,"Hillsborough County":0.84,"Holmes County":0.44,"Indian River County":0.71,"Jackson County":0.49,"Jefferson County":0.65,"Lafayette County":0.6,"Lake County":0.77,"Lee County":0.78,"Leon County":0.77,"Levy County":0.65,"Liberty County":0.61,"Madison County":0.64,"Manatee County":0.76,"Marion County":0.72,"Martin County":0.76,"Miami-Dade County":0.81,"Monroe County":0.53,"Nassau County":0.73,"Okaloosa County":0.59,"Okeechobee County":0.73,"Orange County":0.82,"Osceola County":0.76,"Palm Beach County":0.82,"Pasco County":0.82,"Pinellas County":0.74,"Polk County":0.73,"Putnam County":0.64,"St. Johns County":0.75,"St. Lucie County":0.95,"Santa Rosa County":0.6,"Sarasota County":0.72,"Seminole County":0.7,"Sumter County":0.74,"Suwannee County":0.67,"Taylor County":0.65,"Union County":0.53,"Volusia County":0.78,"Wakulla County":0.69,"Walton County":0.49,"Washington County":0.46},"Georgia":{"Appling County":0.65,"Atkinson County":0.78,"Bacon County":0.89,"Baker County":0.8,"Baldwin County":0.6,"Banks County":0.6,"Barrow County":0.8,"Bartow County":0.69,"Ben Hill County":0.9,"Berrien County":0.74,"Bibb County":0.98,"Bleckley County":0.96,"Brantley County":0.96,"Brooks County":0.88,"Bryan County":0.77,"Bulloch County":0.64,"Burke County":0.52,"Butts County":0.83,"Calhoun County":0.76,"Camden County":0.82,"Candler County":0.96,"Carroll County":0.63,"Catoosa County":0.62,"Charlton County":0.66,"Chatham County":0.81,"Chattahoochee County":0.67,"Chattooga County":0.71,"Cherokee County":0.69,"Clarke County":0.86,"Clay County":1.0,"Clayton County":0.85,"Clinch County":1.07,"Cobb County":0.69,"Coffee County":0.6,"Colquitt County":0.76,"Columbia County":0.82,"Cook County":0.74,"Coweta County":0.7,"Crawford County":0.84,"Crisp County":0.94,"Dade County":0.56,"Dawson County":0.61,"Decatur County":0.94,"DeKalb County":0.93,"Dodge County":0.73,"Dooly County":0.95,"Dougherty County":1.2,"Douglas County":0.8,"Early County":0.77,"Echols County":0.8,"Effingham County":0.89,"Elbert County":0.78,"Emanuel County":0.78,"Evans County":0.94,"Fannin County":0.4,"Fayette County":0.78,"Floyd County":0.92,"Forsyth County":0.69,"Franklin County":0.65,"Fulton County":0.89,"Gilmer County":0.41,"Glascock County":0.81,"Glynn County":0.52,"Gordon County":0.66,"Grady County":0.92,"Greene County":0.55,"Gwinnett County":0.93,"Habersham County":0.57,"Hall County":0.69,"Hancock County":0.94,"Haralson County":0.69,"Harris County":0.8,"Hart County":0.52,"Heard County":0.51,"Henry County":0.89,"Houston County":0.83,"Irwin County":0.76,"Jackson County":0.79,"Jasper County":0.81,"Jeff Davis County":0.65,"Jefferson County":0.89,"Jenkins County":0.82,"Johnson County":0.81,"Jones County":0.96,"Lamar County":0.93,"Lanier County":0.87,"Laurens County":0.53,"Lee County":0.93,"Liberty County":0.93,"Lincoln County":0.8,"Long County":0.71,"Lowndes County":0.76,"Lumpkin County":0.64,"McDuffie County":0.77,"McIntosh County":0.73,"Macon County":1.11,"Madison County":0.74,"Marion County":0.64,"Meriwether County":0.81,"Miller County":1.15,"Mitchell County":1.08,"Monroe County":0.73,"Montgomery County":0.81,"Morgan County":0.72,"Murray County":0.43,"Muscogee County":0.85,"Newton County":0.85,"Oconee County":0.67,"Oglethorpe County":0.68,"Paulding County":0.82,"Peach County":0.78,"Pickens County":0.58,"Pierce County":0.77,"Pike County":0.84,"Polk County":0.73,"Pulaski County":0.91,"Putnam County":0.63,"Quitman County":0.73,"Rabun County":0.49,"Randolph County":0.95,"Richmond County":0.85,"Rockdale County":0.71,"Schley County":0.91,"Screven County":0.94,"Seminole County":0.99,"Spalding County":0.89,"Stephens County":0.71,"Stewart County":0.93,"Sumter County":1.04,"Talbot County":0.83,"Taliaferro County":0.8,"Tattnall County":0.67,"Taylor County":0.75,"Telfair County":0.7,"Terrell County":0.97,"Thomas County":0.84,"Tift County":0.86,"Toombs County":0.82,"Towns County":0.35,"Treutlen County":0.66,"Troup County":0.87,"Turner County":0.92,"Twiggs County":0.35,"Union County":0.45,"Upson County":0.81,"Walker County":0.86,"Walton County":0.72,"Ware County":0.85,"Warren County":0.78,"Washington County":0.85,"Wayne County":0.75,"Webster County":0.77,"Wheeler County":0.84,"White County":0.62,"Whitfield County":0.64,"Wilcox County":0.94,"Wilkes County":0.87,"Wilkinson County":0.87,"Worth County":0.98},"Hawaii":{"Hawaii County":0.35,"Honolulu County":0.31,"Kauai County":0.25,"Maui County":0.22},"Idaho":{"Ada County":0.53,"Adams County":0.34,"Bannock County":0.67,"Bear Lake County":0.41,"Benewah County":0.43,"Bingham County":0.5,"Blaine County":0.38,"Boise County":0.38,"Bonner County":0.4,"Bonneville County":0.53,"Boundary County":0.33,"Butte County":0.53,"Camas County":0.35,"Canyon County":0.5,"Caribou County":0.53,"Cassia County":0.4,"Clark County":0.31,"Clearwater County":0.51,"Custer County":0.42,"Elmore County":0.6,"Franklin County":0.38,"Fremont County":0.39,"Gem County":0.32,"Gooding County":0.43,"Idaho County":0.32,"Jefferson County":0.47,"Jerome County":0.62,"Kootenai County":0.41,"Latah County":0.59,"Lemhi County":0.32,"Lewis County":0.55,"Lincoln County":0.42,"Madison County":0.54,"Minidoka County":0.51,"Nez Perce County":0.75,"Oneida County":0.46,"Owyhee County":0.39,"Payette County":0.45,"Power County":0.62,"Shoshone County":0.54,"Teton County":0.35,"Twin Falls County":0.61,"Valley County":0.34,"Washington County":0.47},"Illinois":{"Adams County":1.52,"Alexander County":1.17,"Bond County":1.78,"Boone County":1.99,"Brown County":1.34,"Bureau County":1.7,"Calhoun County":1.08,"Carroll County":1.75,"Cass County":1.55,"Champaign County":2.04,"Christian County":1.49,"Clark County":1.39,"Clay County":1.22,"Clinton County":1.64,"Coles County":1.72,"Cook County":1.73,"Crawford County":1.36,"Cumberland County":1.26,"DeKalb County":2.24,"De Witt County":1.65,"Douglas County":1.64,"DuPage County":1.89,"Edgar County":1.33,"Edwards County":1.26,"Effingham County":1.37,"Fayette County":1.27,"Ford County":1.83,"Franklin County":1.18,"Fulton County":1.71,"Gallatin County":1.39,"Greene County":0.93,"Grundy County":1.86,"Hamilton County":1.22,"Hancock County":1.5,"Hardin County":0.83,"Henderson County":1.42,"Henry County":1.86,"Iroquois County":1.5,"Jackson County":1.84,"Jasper County":1.56,"Jefferson County":1.58,"Jersey County":1.58,"Jo Daviess County":1.49,"Johnson County":1.33,"Kane County":2.18,"Kankakee County":2.04,"Kendall County":2.28,"Knox County":1.81,"Lake County":2.26,"LaSalle County":1.9,"Lawrence County":0.9,"Lee County":1.77,"Livingston County":1.88,"Logan County":1.72,"McDonough County":1.82,"McHenry County":2.26,"McLean County":2.11,"Macon County":1.99,"Macoupin County":1.39,"Madison County":1.79,"Marion County":1.54,"Marshall County":1.7,"Mason County":1.8,"Massac County":1.3,"Menard County":1.66,"Mercer County":1.77,"Monroe County":1.46,"Montgomery County":1.32,"Morgan County":1.7,"Moultrie County":1.74,"Ogle County":1.81,"Peoria County":2.15,"Perry County":1.42,"Piatt County":1.66,"Pike County":1.42,"Pope County":0.99,"Pulaski County":1.03,"Putnam County":1.46,"Randolph County":1.29,"Richland County":1.16,"Rock Island County":2.13,"St. Clair County":1.83,"Saline County":1.65,"Sangamon County":1.89,"Schuyler County":1.55,"Scott County":1.35,"Shelby County":1.34,"Stark County":1.62,"Stephenson County":2.09,"Tazewell County":1.98,"Union County":1.15,"Vermilion County":1.62,"Wabash County":1.3,"Warren County":1.28,"Washington County":1.58,"Wayne County":1.42,"White County":1.01,"Whiteside County":1.74,"Will County":2.1,"Williamson County":1.57,"Winnebago County":2.28,"Woodford County":1.9},"Indiana":{"Adams County":0.7,"Allen County":0.77,"Bartholomew County":0.71,"Benton County":0.71,"Blackford County":0.75,"Boone County":0.83,"Brown County":0.45,"Carroll County":0.57,"Cass County":0.69,"Clark County":0.71,"Clay County":0.48,"Clinton County":0.64,"Crawford County":0.63,"Daviess County":0.69,"Dearborn County":0.72,"Decatur County":0.57,"DeKalb County":0.61,"Delaware County":0.81,"Dubois County":0.71,"Elkhart County":0.82,"Fayette County":0.62,"Floyd County":0.66,"Fountain County":0.61,"Franklin County":0.55,"Fulton County":0.59,"Gibson County":0.6,"Grant County":0.67,"Greene County":0.62,"Hamilton County":0.87,"Hancock County":0.68,"Harrison County":0.56,"Hendricks County":0.81,"Henry County":0.67,"Howard County":0.67,"Huntington County":0.68,"Jackson County":0.53,"Jasper County":0.5,"Jay County":0.6,"Jefferson County":0.64,"Jennings County":0.61,"Johnson County":0.73,"Knox County":0.74,"Kosciusko County":0.63,"LaGrange County":0.49,"Lake County":0.93,"LaPorte County":0.79,"Lawrence County":0.69,"Madison County":0.73,"Marion County":0.89,"Marshall County":0.67,"Martin County":0.55,"Miami County":0.48,"Monroe County":0.74,"Montgomery County":0.64,"Morgan County":0.51,"Newton County":0.79,"Noble County":0.66,"Ohio County":0.68,"Orange County":0.73,"Owen County":0.64,"Parke County":0.46,"Perry County":0.63,"Pike County":0.77,"Porter County":0.81,"Posey County":0.52,"Pulaski County":0.56,"Putnam County":0.45,"Randolph County":0.76,"Ripley County":0.58,"Rush County":0.6,"St. Joseph County":0.85,"Scott County":0.65,"Shelby County":0.67,"Spencer County":0.6,"Starke County":0.65,"Steuben County":0.54,"Sullivan County":0.62,"Switzerland County":0.45,"Tippecanoe County":0.67,"Tipton County":0.63,"Union County":0.71,"Vanderburgh County":0.81,"Vermillion County":0.79,"Vigo County":0.82,"Wabash County":0.51,"Warren County":0.55,"Warrick County":0.68,"Washington County":0.59,"Wayne County":0.77,"Wells County":0.49,"White County":0.56,"Whitley County":0.72},"Iowa":{"Adair County":1.15,"Adams County":0.95,"Allamakee County":0.94,"Appanoose County":1.15,"Audubon County":0.86,"Benton County":1.23,"Black Hawk County":1.33,"Boone County":1.29,"Bremer County":1.23,"Buchanan County":1.22,"Buena Vista County":1.36,"Butler County":1.25,"Calhoun County":1.11,"Carroll County":1.22,"Cass County":1.4,"Cedar County":1.08,"Cerro Gordo County":1.27,"Cherokee County":0.96,"Chickasaw County":1.0,"Clarke County":1.23,"Clay County":0.93,"Clayton County":0.98,"Clinton County":1.34,"Crawford County":1.28,"Dallas County":1.37,"Davis County":1.51,"Decatur County":1.33,"Delaware County":1.16,"Des Moines County":1.36,"Dickinson County":0.78,"Dubuque County":1.15,"Emmet County":1.18,"Fayette County":1.29,"Floyd County":1.15,"Franklin County":1.2,"Fremont County":1.01,"Greene County":1.23,"Grundy County":1.18,"Guthrie County":1.16,"Hamilton County":1.17,"Hancock County":1.18,"Hardin County":1.25,"Harrison County":1.19,"Henry County":1.43,"Howard County":1.17,"Humboldt County":1.34,"Ida County":0.95,"Iowa County":1.19,"Jackson County":0.94,"Jasper County":1.24,"Jefferson County":1.35,"Johnson County":1.4,"Jones County":1.16,"Keokuk County":1.13,"Kossuth County":1.06,"Lee County":1.28,"Linn County":1.47,"Louisa County":1.08,"Lucas County":1.0,"Lyon County":0.86,"Madison County":1.25,"Mahaska County":1.26,"Marion County":1.17,"Marshall County":1.29,"Mills County":1.13,"Mitchell County":0.99,"Monona County":1.06,"Monroe County":1.39,"Montgomery County":1.33,"Muscatine County":1.32,"O'Brien County":1.03,"Osceola County":0.95,"Page County":1.2,"Palo Alto County":1.06,"Plymouth County":0.99,"Pocahontas County":1.06,"Polk County":1.57,"Pottawattamie County":1.32,"Poweshiek County":1.11,"Ringgold County":1.15,"Sac County":0.93,"Scott County":1.44,"Shelby County":1.19,"Sioux County":1.08,"Story County":1.36,"Tama County":1.2,"Taylor County":1.14,"Union County":1.48,"Van Buren County":0.78,"Wapello County":1.37,"Warren County":1.39,"Washington County":1.2,"Wayne County":1.14,"Webster County":1.39,"Winnebago County":1.35,"Winneshiek County":0.99,"Woodbury County":1.39,"Worth County":0.91,"Wright County":1.28},"Kansas":{"Allen County":1.3,"Anderson County":1.37,"Atchison County":1.31,"Barber County":1.36,"Barton County":1.57,"Bourbon County":1.35,"Brown County":1.06,"Butler County":1.47,"Chase County":1.26,"Chautauqua County":1.0,"Cherokee County":1.06,"Cheyenne County":1.35,"Clark County":1.05,"Clay County":1.32,"Cloud County":1.5,"Coffey County":0.91,"Comanche County":1.93,"Cowley County":1.15,"Crawford County":1.06,"Decatur County":1.51,"Dickinson County":1.38,"Doniphan County":0.91,"Douglas County":1.19,"Edwards County":1.18,"Elk County":1.66,"Ellis County":1.12,"Ellsworth County":1.46,"Finney County":1.36,"Ford County":1.34,"Franklin County":1.31,"Geary County":1.47,"Gove County":1.27,"Graham County":1.47,"Grant County":1.21,"Gray County":1.35,"Greeley County":1.79,"Greenwood County":1.22,"Hamilton County":1.58,"Harper County":1.56,"Harvey County":1.4,"Haskell County":1.35,"Hodgeman County":1.35,"Jackson County":1.1,"Jefferson County":1.11,"Jewell County":1.21,"Johnson County":1.12,"Kearny County":1.14,"Kingman County":1.38,"Kiowa County":1.21,"Labette County":1.4,"Lane County":1.37,"Leavenworth County":1.03,"Lincoln County":1.54,"Linn County":1.0,"Logan County":1.69,"Lyon County":1.36,"McPherson County":1.33,"Marion County":1.45,"Marshall County":1.14,"Meade County":1.12,"Miami County":1.19,"Mitchell County":1.49,"Montgomery County":1.56,"Morris County":1.44,"Morton County":1.84,"Nemaha County":0.91,"Neosho County":1.41,"Ness County":1.55,"Norton County":1.1,"Osage County":1.32,"Osborne County":1.34,"Ottawa County":1.34,"Pawnee County":1.69,"Phillips County":1.19,"Pottawatomie County":1.0,"Pratt County":1.55,"Rawlins County":1.43,"Reno County":1.48,"Republic County":1.43,"Rice County":1.35,"Riley County":1.41,"Rooks County":1.54,"Rush County":1.33,"Russell County":1.56,"Saline County":1.34,"Scott County":1.57,"Sedgwick County":1.18,"Seward County":1.56,"Shawnee County":1.34,"Sheridan County":1.21,"Sherman County":1.45,"Smith County":1.71,"Stafford County":1.26,"Stanton County":1.91,"Stevens County":1.78,"Sumner County":1.36,"Thomas County":1.34,"Trego County":1.39,"Wabaunsee County":1.06,"Wallace County":1.38,"Washington County":0.9,"Wichita County":1.35,"Wilson County":1.27,"Woodson County":1.36,"Wyandotte County":1.39},"Kentucky":{"Adair County":0.56,"Allen County":0.57,"Anderson County":0.72,"Ballard County":0.66,"Barren County":0.59,"Bath County":0.56,"Bell County":0.57,"Boone County":0.84,"Bourbon County":0.57,"Boyd County":0.79,"Boyle County":0.76,"Bracken County":0.73,"Breathitt County":0.66,"Breckinridge County":0.54,"Bullitt County":0.84,"Butler County":0.5,"Caldwell County":0.52,"Calloway County":0.61,"Campbell County":1.06,"Carlisle County":0.51,"Carroll County":0.62,"Carter County":0.45,"Casey County":0.54,"Christian County":0.59,"Clark County":0.75,"Clay County":0.49,"Clinton County":0.42,"Crittenden County":0.47,"Cumberland County":0.51,"Daviess County":0.81,"Edmonson County":0.51,"Elliott County":0.5,"Estill County":0.63,"Fayette County":0.84,"Fleming County":0.57,"Floyd County":0.67,"Franklin County":0.73,"Fulton County":0.64,"Gallatin County":0.71,"Garrard County":0.59,"Grant County":0.66,"Graves County":0.58,"Grayson County":0.5,"Green County":0.17,"Greenup County":0.94,"Hancock County":0.66,"Hardin County":0.63,"Harlan County":0.74,"Harrison County":0.5,"Hart County":0.68,"Henderson County":0.86,"Henry County":0.73,"Hickman County":0.55,"Hopkins County":0.73,"Jackson County":0.47,"Jefferson County":0.85,"Jessamine County":0.73,"Johnson County":0.57,"Kenton County":0.96,"Knott County":0.51,"Knox County":0.54,"Larue County":0.58,"Laurel County":0.49,"Lawrence County":0.61,"Lee County":0.76,"Leslie County":0.67,"Letcher County":0.67,"Lewis County":0.5,"Lincoln County":0.64,"Livingston County":0.54,"Logan County":0.65,"Lyon County":0.57,"McCracken County":0.79,"McCreary County":0.47,"McLean County":0.66,"Madison County":0.71,"Magoffin County":0.4,"Marion County":0.6,"Marshall County":0.67,"Martin County":0.56,"Mason County":0.64,"Meade County":0.66,"Menifee County":0.45,"Mercer County":0.72,"Metcalfe County":0.51,"Monroe County":0.56,"Montgomery County":0.75,"Morgan County":0.54,"Muhlenberg County":0.59,"Nelson County":0.74,"Nicholas County":0.51,"Ohio County":0.58,"Oldham County":0.92,"Owen County":0.64,"Owsley County":0.58,"Pendleton County":0.65,"Perry County":0.6,"Pike County":0.64,"Powell County":0.5,"Pulaski County":0.5,"Robertson County":0.39,"Rockcastle County":0.49,"Rowan County":0.56,"Russell County":0.5,"Scott County":0.62,"Shelby County":0.73,"Simpson County":0.61,"Spencer County":0.65,"Taylor County":0.61,"Todd County":0.55,"Trigg County":0.63,"Trimble County":0.56,"Union County":0.8,"Warren County":0.62,"Washington County":0.58,"Wayne County":0.5,"Webster County":0.68,"Whitley County":0.57,"Wolfe County":0.37,"Woodford County":0.67},"Louisiana":{"Acadia Parish":0.36,"Allen Parish":0.34,"Ascension Parish":0.51,"Assumption Parish":0.37,"Avoyelles Parish":0.22,"Beauregard Parish":0.21,"Bienville Parish":0.24,"Bossier Parish":0.66,"Caddo Parish":0.68,"Calcasieu Parish":0.47,"Caldwell Parish":0.29,"Cameron Parish":0.43,"Catahoula Parish":0.25,"Claiborne Parish":0.26,"Concordia Parish":0.31,"De Soto Parish":0.31,"East Baton Rouge Parish":0.63,"East Carroll Parish":0.32,"East Feliciana Parish":0.2,"Evangeline Parish":0.31,"Franklin Parish":0.25,"Grant Parish":0.33,"Iberia Parish":0.36,"Iberville Parish":0.35,"Jackson Parish":0.24,"Jefferson Parish":0.57,"Jefferson Davis Parish":0.45,"Lafayette Parish":0.57,"Lafourche Parish":0.42,"LaSalle Parish":0.28,"Lincoln Parish":0.46,"Livingston Parish":0.44,"Madison Parish":0.31,"Morehouse Parish":0.49,"Natchitoches Parish":0.4,"Orleans Parish":0.85,"Ouachita Parish":0.52,"Plaquemines Parish":0.43,"Pointe Coupee Parish":0.32,"Rapides Parish":0.48,"Red River Parish":0.21,"Richland Parish":0.23,"Sabine Parish":0.25,"St. Bernard Parish":0.34,"St. Charles Parish":0.54,"St. Helena Parish":0.13,"St. James Parish":0.47,"St. John the Baptist Parish":0.42,"St. Landry Parish":0.25,"St. Martin Parish":0.35,"St. Mary Parish":0.38,"St. Tammany Parish":0.71,"Tangipahoa Parish":0.34,"Tensas Parish":0.33,"Terrebonne Parish":0.4,"Union Parish":0.32,"Vermilion Parish":0.33,"Vernon Parish":0.27,"Washington Parish":0.27,"Webster Parish":0.29,"West Baton Rouge Parish":0.47,"West Carroll Parish":0.13,"West Feliciana Parish":0.43,"Winn Parish":0.19},"Maine":{"Androscoggin County":1.19,"Aroostook County":1.06,"Cumberland County":1.01,"Franklin County":0.99,"Hancock County":0.84,"Kennebec County":1.04,"Knox County":1.08,"Lincoln County":0.85,"Oxford County":0.87,"Penobscot County":1.11,"Piscataquis County":0.78,"Sagadahoc County":0.99,"Somerset County":0.99,"Waldo County":1.0,"Washington County":0.93,"York County":0.89},"Maryland":{"Allegany County":0.94,"Anne Arundel County":0.8,"Baltimore County":0.96,"Calvert County":0.83,"Caroline County":0.75,"Carroll County":0.87,"Cecil County":0.86,"Charles County":0.97,"Dorchester County":0.84,"Frederick County":0.94,"Garrett County":0.72,"Harford County":0.83,"Howard County":1.11,"Kent County":0.92,"Montgomery County":0.85,"Prince George's County":1.06,"Queen Anne's County":0.74,"St. Mary's County":0.77,"Somerset County":0.7,"Talbot County":0.56,"Washington County":0.81,"Wicomico County":0.77,"Worcester County":0.73,"Baltimore city":1.37},"Massachusetts":{"Barnstable County":0.65,"Berkshire County":1.13,"Bristol County":1.03,"Dukes County":0.46,"Essex County":1.02,"Franklin County":1.32,"Hampden County":1.41,"Hampshire County":1.36,"Middlesex County":1.01,"Nantucket County":0.27,"Norfolk County":1.02,"Plymouth County":1.06,"Suffolk County":0.69,"Worcester County":1.25},"Michigan":{"Alcona County":0.81,"Alger County":0.89,"Allegan County":1.0,"Alpena County":1.01,"Antrim County":0.8,"Arenac County":1.0,"Baraga County":0.86,"Barry County":0.96,"Bay County":1.31,"Benzie County":0.77,"Berrien County":1.02,"Branch County":1.01,"Calhoun County":1.34,"Cass County":0.93,"Charlevoix County":0.84,"Cheboygan County":0.87,"Chippewa County":1.12,"Clare County":0.99,"Clinton County":1.19,"Crawford County":1.0,"Delta County":1.06,"Dickinson County":1.15,"Eaton County":1.34,"Emmet County":0.82,"Genesee County":1.25,"Gladwin County":1.01,"Gogebic County":1.22,"Grand Traverse County":0.84,"Gratiot County":1.1,"Hillsdale County":0.91,"Houghton County":1.13,"Huron County":1.07,"Ingham County":1.76,"Ionia County":1.0,"Iosco County":0.88,"Iron County":1.05,"Isabella County":1.17,"Jackson County":1.11,"Kalamazoo County":1.35,"Kalkaska County":0.88,"Kent County":1.05,"Keweenaw County":1.0,"Lake County":0.81,"Lapeer County":0.81,"Leelanau County":0.66,"Lenawee County":1.15,"Livingston County":0.95,"Luce County":0.77,"Mackinac County":0.86,"Macomb County":1.23,"Manistee County":0.91,"Marquette County":0.99,"Mason County":0.98,"Mecosta County":0.93,"Menominee County":0.93,"Midland County":1.39,"Missaukee County":0.83,"Monroe County":1.04,"Montcalm County":0.99,"Montmorency County":0.84,"Muskegon County":1.1,"Newaygo County":0.98,"Oakland County":1.25,"Oceana County":0.82,"Ogemaw County":0.91,"Ontonagon County":1.13,"Osceola County":0.91,"Oscoda County":0.79,"Otsego County":0.77,"Ottawa County":1.03,"Presque Isle County":0.85,"Roscommon County":0.89,"Saginaw County":1.34,"St. Clair County":1.04,"St. Joseph County":1.01,"Sanilac County":0.8,"Schoolcraft County":0.89,"Shiawassee County":1.12,"Tuscola County":1.09,"Van Buren County":1.11,"Washtenaw County":1.46,"Wayne County":1.47,"Wexford County":1.06},"Minnesota":{"Aitkin County":0.58,"Anoka County":0.94,"Becker County":0.7,"Beltrami County":0.8,"Benton County":0.92,"Big Stone County":0.87,"Blue Earth County":0.96,"Brown County":1.0,"Carlton County":1.08,"Carver County":0.96,"Cass County":0.56,"Chippewa County":1.03,"Chisago County":1.02,"Clay County":1.11,"Clearwater County":0.69,"Cook County":0.69,"Cottonwood County":1.05,"Crow Wing County":0.72,"Dakota County":0.96,"Dodge County":1.01,"Douglas County":0.84,"Faribault County":0.9,"Fillmore County":0.81,"Freeborn County":1.08,"Goodhue County":0.98,"Grant County":0.86,"Hennepin County":1.1,"Houston County":1.03,"Hubbard County":0.74,"Isanti County":0.97,"Itasca County":0.86,"Jackson County":0.84,"Kanabec County":1.08,"Kandiyohi County":0.91,"Kittson County":0.81,"Koochiching County":0.79,"Lac qui Parle County":0.9,"Lake County":0.61,"Lake of the Woods County":0.82,"Le Sueur County":0.98,"Lincoln County":0.9,"Lyon County":0.98,"McLeod County":1.09,"Mahnomen County":0.87,"Marshall County":0.82,"Martin County":1.0,"Meeker County":0.83,"Mille Lacs County":0.96,"Morrison County":0.81,"Mower County":0.98,"Murray County":0.75,"Nicollet County":1.04,"Nobles County":0.86,"Norman County":0.91,"Olmsted County":1.01,"Otter Tail County":0.73,"Pennington County":1.08,"Pine County":0.83,"Pipestone County":0.83,"Polk County":1.01,"Pope County":0.69,"Ramsey County":1.19,"Red Lake County":1.01,"Redwood County":0.82,"Renville County":1.01,"Rice County":1.01,"Rock County":0.73,"Roseau County":0.94,"St. Louis County":1.02,"Scott County":0.95,"Sherburne County":0.95,"Sibley County":0.95,"Stearns County":0.91,"Steele County":1.16,"Stevens County":0.82,"Swift County":0.8,"Todd County":0.95,"Traverse County":0.92,"Wabasha County":0.95,"Wadena County":1.01,"Waseca County":1.13,"Washington County":0.94,"Watonwan County":1.02,"Wilkin County":0.91,"Winona County":0.86,"Wright County":0.95,"Yellow Medicine County":0.96},"Mississippi":{"Adams County":0.51,"Alcorn County":0.46,"Amite County":0.33,"Attala County":0.54,"Benton County":0.39,"Bolivar County":0.55,"Calhoun County":0.55,"Carroll County":0.51,"Chickasaw County":0.42,"Choctaw County":0.4,"Claiborne County":0.31,"Clarke County":0.41,"Clay County":0.57,"Coahoma County":0.75,"Copiah County":0.42,"Covington County":0.41,"DeSoto County":0.53,"Forrest County":0.7,"Franklin County":0.54,"George County":0.53,"Greene County":0.52,"Grenada County":0.75,"Hancock County":0.66,"Harrison County":0.59,"Hinds County":0.72,"Holmes County":0.51,"Humphreys County":0.74,"Issaquena County":0.32,"Itawamba County":0.42,"Jackson County":0.67,"Jasper County":0.41,"Jefferson County":0.62,"Jefferson Davis County":0.53,"Jones County":0.7,"Kemper County":0.49,"Lafayette County":0.52,"Lamar County":0.63,"Lauderdale County":0.65,"Lawrence County":0.61,"Leake County":0.58,"Lee County":0.7,"Leflore County":0.77,"Lincoln County":0.57,"Lowndes County":0.54,"Madison County":0.62,"Marion County":0.57,"Marshall County":0.6,"Monroe County":0.48,"Montgomery County":0.81,"Neshoba County":0.53,"Newton County":0.49,"Noxubee County":0.39,"Oktibbeha County":0.69,"Panola County":0.56,"Pearl River County":0.58,"Perry County":0.44,"Pike County":0.6,"Pontotoc County":0.5,"Prentiss County":0.48,"Quitman County":0.72,"Rankin County":0.58,"Scott County":0.51,"Sharkey County":0.72,"Simpson County":0.44,"Smith County":0.38,"Stone County":0.49,"Sunflower County":0.65,"Tallahatchie County":0.45,"Tate County":0.63,"Tippah County":0.56,"Tishomingo County":0.34,"Tunica County":0.45,"Union County":0.42,"Walthall County":0.49,"Warren County":0.47,"Washington County":0.92,"Wayne County":0.47,"Webster County":0.44,"Wilkinson County":0.62,"Winston County":0.49,"Yalobusha County":0.47,"Yazoo County":0.53},"Missouri":{"Adair County":0.67,"Andrew County":0.69,"Atchison County":1.06,"Audrain County":0.72,"Barry County":0.46,"Barton County":0.59,"Bates County":0.56,"Benton County":0.47,"Bollinger County":0.48,"Boone County":0.82,"Buchanan County":0.74,"Butler County":0.64,"Caldwell County":0.64,"Callaway County":0.66,"Camden County":0.46,"Cape Girardeau County":0.63,"Carroll County":0.69,"Carter County":0.44,"Cass County":0.83,"Cedar County":0.59,"Chariton County":0.69,"Christian County":0.69,"Clark County":0.66,"Clay County":1.06,"Clinton County":0.72,"Cole County":0.73,"Cooper County":0.63,"Crawford County":0.51,"Dade County":0.57,"Dallas County":0.42,"Daviess County":0.49,"DeKalb County":0.59,"Dent County":0.35,"Douglas County":0.38,"Dunklin County":0.71,"Franklin County":0.73,"Gasconade County":0.63,"Gentry County":0.74,"Greene County":0.72,"Grundy County":0.77,"Harrison County":0.8,"Henry County":0.62,"Hickory County":0.4,"Holt County":0.79,"Howard County":0.53,"Howell County":0.44,"Iron County":0.49,"Jackson County":1.13,"Jasper County":0.68,"Jefferson County":0.8,"Johnson County":0.69,"Knox County":0.65,"Laclede County":0.54,"Lafayette County":0.69,"Lawrence County":0.49,"Lewis County":0.64,"Lincoln County":0.69,"Linn County":0.7,"Livingston County":0.75,"McDonald County":0.35,"Macon County":0.65,"Madison County":0.64,"Maries County":0.45,"Marion County":0.75,"Mercer County":0.69,"Miller County":0.55,"Mississippi County":0.77,"Moniteau County":0.61,"Monroe County":0.74,"Montgomery County":0.58,"Morgan County":0.48,"New Madrid County":0.67,"Newton County":0.62,"Nodaway County":0.78,"Oregon County":0.49,"Osage County":0.51,"Ozark County":0.43,"Pemiscot County":0.79,"Perry County":0.57,"Pettis County":0.65,"Phelps County":0.63,"Pike County":0.61,"Platte County":1.04,"Polk County":0.52,"Pulaski County":0.6,"Putnam County":0.86,"Ralls County":0.64,"Randolph County":0.81,"Ray County":0.72,"Reynolds County":0.42,"Ripley County":0.48,"St. Charles County":1.06,"St. Clair County":0.51,"Ste. Genevieve County":0.66,"St. Francois County":0.63,"St. Louis County":1.14,"Saline County":0.66,"Schuyler County":0.72,"Scotland County":0.65,"Scott County":0.58,"Shannon County":0.36,"Shelby County":0.81,"Stoddard County":0.67,"Stone County":0.44,"Sullivan County":0.56,"Taney County":0.54,"Texas County":0.44,"Vernon County":0.64,"Warren County":0.59,"Washington County":0.52,"Wayne County":0.54,"Webster County":0.49,"Worth County":0.88,"Wright County":0.34,"St. Louis city":1.03},"Montana":{"Beaverhead County":0.51,"Big Horn County":0.56,"Blaine County":0.68,"Broadwater County":0.5,"Carbon County":0.42,"Carter County":0.2,"Cascade County":0.77,"Chouteau County":0.64,"Custer County":0.8,"Daniels County":1.04,"Dawson County":1.0,"Deer Lodge County":0.66,"Fallon County":0.43,"Fergus County":0.77,"Flathead County":0.54,"Gallatin County":0.55,"Garfield County":0.56,"Glacier County":0.49,"Golden Valley County":0.36,"Granite County":0.42,"Hill County":0.9,"Jefferson County":0.51,"Judith Basin County":0.5,"Lake County":0.48,"Lewis and Clark County":0.73,"Liberty County":1.26,"Lincoln County":0.5,"McCone County":0.74,"Madison County":0.34,"Meagher County":0.42,"Mineral County":0.5,"Missoula County":0.78,"Musselshell County":0.51,"Park County":0.38,"Petroleum County":0.57,"Phillips County":0.54,"Pondera County":0.73,"Powder River County":0.32,"Powell County":0.53,"Prairie County":0.49,"Ravalli County":0.41,"Richland County":0.72,"Roosevelt County":0.67,"Rosebud County":0.51,"Sanders County":0.46,"Sheridan County":1.01,"Silver Bow County":0.84,"Stillwater County":0.55,"Sweet Grass County":0.36,"Teton County":0.72,"Toole County":0.66,"Treasure County":0.48,"Valley County":0.92,"Wheatland County":0.48,"Wibaux County":0.59,"Yellowstone County":0.74},"Nebraska":{"Adams County":1.37,"Antelope County":1.1,"Arthur County":1.17,"Banner County":1.11,"Blaine County":0.94,"Boone County":1.03,"Box Butte County":1.37,"Boyd County":1.16,"Brown County":0.96,"Buffalo County":1.38,"Burt County":1.13,"Butler County":1.12,"Cass County":1.29,"Cedar County":1.03,"Chase County":1.02,"Cherry County":0.95,"Cheyenne County":1.54,"Clay County":1.18,"Colfax County":1.13,"Cuming County":1.13,"Custer County":1.03,"Dakota County":1.25,"Dawes County":1.21,"Dawson County":1.13,"Deuel County":1.33,"Dixon County":1.07,"Dodge County":1.32,"Douglas County":1.62,"Dundy County":0.9,"Fillmore County":1.2,"Franklin County":0.82,"Frontier County":1.41,"Furnas County":1.13,"Gage County":1.26,"Garden County":0.87,"Garfield County":1.11,"Gosper County":0.89,"Grant County":0.74,"Greeley County":1.1,"Hall County":1.27,"Hamilton County":0.96,"Harlan County":1.04,"Hayes County":1.92,"Hitchcock County":1.11,"Holt County":1.06,"Hooker County":0.9,"Howard County":1.06,"Jefferson County":1.32,"Johnson County":0.78,"Kearney County":0.97,"Keith County":1.19,"Keya Paha County":1.14,"Kimball County":1.28,"Knox County":1.07,"Lancaster County":1.43,"Lincoln County":1.42,"Logan County":0.45,"Loup County":0.84,"McPherson County":0.77,"Madison County":1.32,"Merrick County":1.02,"Morrill County":1.08,"Nance County":1.19,"Nemaha County":1.27,"Nuckolls County":0.83,"Otoe County":1.29,"Pawnee County":1.29,"Perkins County":0.95,"Phelps County":1.26,"Pierce County":1.22,"Platte County":1.26,"Polk County":0.93,"Red Willow County":1.16,"Richardson County":1.09,"Rock County":0.54,"Saline County":1.22,"Sarpy County":1.72,"Saunders County":1.21,"Scotts Bluff County":1.39,"Seward County":1.18,"Sheridan County":1.14,"Sherman County":1.18,"Sioux County":0.78,"Stanton County":1.19,"Thayer County":0.95,"Thomas County":0.79,"Thurston County":1.12,"Valley County":1.05,"Washington County":1.37,"Wayne County":1.2,"Webster County":1.32,"Wheeler County":0.98,"York County":1.1},"Nevada":{"Churchill County":0.52,"Clark County":0.52,"Douglas County":0.45,"Elko County":0.56,"Esmeralda County":0.52,"Eureka County":0.34,"Humboldt County":0.56,"Lander County":0.73,"Lincoln County":0.54,"Lyon County":0.5,"Mineral County":0.73,"Nye County":0.51,"Pershing County":0.68,"Storey County":0.42,"Washoe County":0.46,"White Pine County":0.55,"Carson City":0.46},"New Hampshire":{"Belknap County":1.21,"Carroll County":0.87,"Cheshire County":1.87,"Coos County":1.64,"Grafton County":1.52,"Hillsborough County":1.62,"Merrimack County":1.8,"Rockingham County":1.34,"Strafford County":1.76,"Sullivan County":1.77},"New Jersey":{"Atlantic County":1.86,"Bergen County":1.89,"Burlington County":2.07,"Camden County":2.47,"Cape May County":0.93,"Cumberland County":2.02,"Essex County":2.1,"Gloucester County":2.4,"Hudson County":1.56,"Hunterdon County":2.04,"Mercer County":2.15,"Middlesex County":1.99,"Monmouth County":1.53,"Morris County":1.84,"Ocean County":1.42,"Passaic County":2.26,"Salem County":2.19,"Somerset County":1.84,"Sussex County":2.2,"Union County":2.03,"Warren County":2.26},"New Mexico":{"Bernalillo County":0.85,"Catron County":0.27,"Chaves County":0.61,"Cibola County":0.47,"Colfax County":0.51,"Curry County":0.64,"De Baca County":0.55,"Doña Ana County":0.64,"Eddy County":0.45,"Grant County":0.38,"Guadalupe County":0.55,"Harding County":0.27,"Hidalgo County":0.48,"Lea County":0.52,"Lincoln County":0.54,"Los Alamos County":0.56,"Luna County":0.55,"McKinley County":0.35,"Mora County":0.5,"Otero County":0.56,"Quay County":0.54,"Rio Arriba County":0.22,"Roosevelt County":0.6,"Sandoval County":0.66,"San Juan County":0.52,"San Miguel County":0.47,"Santa Fe County":0.45,"Sierra County":0.57,"Socorro County":0.58,"Taos County":0.34,"Torrance County":0.45,"Union County":0.3,"Valencia County":0.57},"New York":{"Albany County":1.7,"Allegany County":2.37,"Bronx County":0.78,"Broome County":2.21,"Cattaraugus County":1.92,"Cayuga County":1.82,"Chautauqua County":1.99,"Chemung County":2.0,"Chenango County":2.05,"Clinton County":1.79,"Columbia County":1.21,"Cortland County":2.2,"Delaware County":1.39,"Dutchess County":1.72,"Erie County":1.72,"Essex County":1.35,"Franklin County":1.45,"Fulton County":1.62,"Genesee County":1.98,"Greene County":1.39,"Hamilton County":0.93,"Herkimer County":1.66,"Jefferson County":1.32,"Kings County":0.56,"Lewis County":1.39,"Livingston County":1.94,"Madison County":1.98,"Monroe County":2.41,"Montgomery County":2.15,"Nassau County":1.72,"New York County":0.71,"Niagara County":1.73,"Oneida County":1.73,"Onondaga County":2.22,"Ontario County":1.89,"Orange County":2.02,"Orleans County":2.23,"Oswego County":1.95,"Otsego County":1.54,"Putnam County":2.12,"Queens County":0.75,"Rensselaer County":1.93,"Richmond County":0.88,"Rockland County":2.06,"St. Lawrence County":1.93,"Saratoga County":1.27,"Schenectady County":2.12,"Schoharie County":1.88,"Schuyler County":1.68,"Seneca County":1.89,"Steuben County":2.12,"Suffolk County":1.62,"Sullivan County":1.81,"Tioga County":2.06,"Tompkins County":2.11,"Ulster County":1.62,"Warren County":1.28,"Washington County":1.73,"Wayne County":2.2,"Westchester County":1.84,"Wyoming County":1.89,"Yates County":1.42},"North Carolina":{"Alamance County":0.66,"Alexander County":0.59,"Alleghany County":0.57,"Anson County":0.68,"Ashe County":0.46,"Avery County":0.37,"Beaufort County":0.58,"Bertie County":0.62,"Bladen County":0.74,"Brunswick County":0.52,"Buncombe County":0.57,"Burke County":0.61,"Cabarrus County":0.74,"Caldwell County":0.61,"Camden County":0.51,"Carteret County":0.44,"Caswell County":0.67,"Catawba County":0.59,"Chatham County":0.62,"Cherokee County":0.45,"Chowan County":0.63,"Clay County":0.46,"Cleveland County":0.64,"Columbus County":0.73,"Craven County":0.65,"Cumberland County":0.87,"Currituck County":0.47,"Dare County":0.51,"Davidson County":0.55,"Davie County":0.61,"Duplin County":0.68,"Durham County":0.81,"Edgecombe County":0.88,"Forsyth County":0.8,"Franklin County":0.7,"Gaston County":0.77,"Gates County":0.58,"Graham County":0.49,"Granville County":0.61,"Greene County":0.78,"Guilford County":0.83,"Halifax County":0.9,"Harnett County":0.68,"Haywood County":0.53,"Henderson County":0.49,"Hertford County":0.86,"Hoke County":0.57,"Hyde County":0.62,"Iredell County":0.58,"Jackson County":0.31,"Johnston County":0.64,"Jones County":0.69,"Lee County":0.76,"Lenoir County":0.74,"Lincoln County":0.61,"McDowell County":0.49,"Macon County":0.39,"Madison County":0.48,"Martin County":0.94,"Mecklenburg County":0.69,"Mitchell County":0.54,"Montgomery County":0.58,"Moore County":0.57,"Nash County":0.66,"New Hanover County":0.55,"Northampton County":0.78,"Onslow County":0.64,"Orange County":0.96,"Pamlico County":0.59,"Pasquotank County":0.64,"Pender County":0.55,"Perquimans County":0.59,"Person County":0.68,"Pitt County":0.81,"Polk County":0.5,"Randolph County":0.67,"Richmond County":0.78,"Robeson County":0.8,"Rockingham County":0.75,"Rowan County":0.67,"Rutherford County":0.62,"Sampson County":0.75,"Scotland County":0.67,"Stanly County":0.57,"Stokes County":0.59,"Surry County":0.59,"Swain County":0.22,"Transylvania County":0.46,"Tyrrell County":0.63,"Union County":0.57,"Vance County":0.65,"Wake County":0.69,"Warren County":0.66,"Washington County":0.93,"Watauga County":0.42,"Wayne County":0.73,"Wilkes County":0.57,"Wilson County":0.8,"Yadkin County":0.59,"Yancey County":0.45},"North Dakota":{"Adams County":0.64,"Barnes County":0.86,"Benson County":0.56,"Billings County":0.47,"Bottineau County":0.59,"Bowman County":0.61,"Burke County":0.44,"Burleigh County":0.85,"Cass County":1.11,"Cavalier County":1.07,"Dickey County":0.9,"Divide County":0.75,"Dunn County":0.43,"Eddy County":0.67,"Emmons County":0.72,"Foster County":0.72,"Golden Valley County":0.64,"Grand Forks County":1.1,"Grant County":0.6,"Griggs County":0.44,"Hettinger County":0.79,"Kidder County":0.57,"LaMoure County":0.71,"Logan County":0.78,"McHenry County":0.71,"McIntosh County":0.87,"McKenzie County":0.43,"McLean County":0.71,"Mercer County":0.86,"Morton County":1.0,"Mountrail County":0.41,"Nelson County":0.61,"Oliver County":0.5,"Pembina County":0.82,"Pierce County":0.95,"Ramsey County":0.89,"Ransom County":0.91,"Renville County":0.66,"Richland County":1.01,"Rolette County":0.33,"Sargent County":1.1,"Sheridan County":0.57,"Sioux County":0.26,"Slope County":0.4,"Stark County":0.82,"Steele County":0.86,"Stutsman County":1.02,"Towner County":0.71,"Traill County":0.91,"Walsh County":0.92,"Ward County":1.04,"Wells County":0.85,"Williams County":0.68},"Ohio":{"Adams County":0.83,"Allen County":1.06,"Ashland County":0.86,"Ashtabula County":1.12,"Athens County":1.16,"Auglaize County":0.94,"Belmont County":1.01,"Brown County":0.82,"Butler County":1.16,"Carroll County":0.79,"Champaign County":1.07,"Clark County":1.15,"Clermont County":1.26,"Clinton County":0.92,"Columbiana County":0.97,"Coshocton County":0.89,"Crawford County":1.11,"Cuyahoga County":1.89,"Darke County":0.86,"Defiance County":1.09,"Delaware County":1.6,"Erie County":1.16,"Fairfield County":1.15,"Fayette County":0.94,"Franklin County":1.53,"Fulton County":1.23,"Gallia County":0.93,"Geauga County":1.42,"Greene County":1.59,"Guernsey County":0.87,"Hamilton County":1.51,"Hancock County":0.96,"Hardin County":1.04,"Harrison County":0.92,"Henry County":1.11,"Highland County":0.78,"Hocking County":0.79,"Holmes County":0.89,"Huron County":0.92,"Jackson County":0.9,"Jefferson County":0.93,"Knox County":1.0,"Lake County":1.5,"Lawrence County":0.87,"Licking County":1.17,"Logan County":0.99,"Lorain County":1.37,"Lucas County":1.66,"Madison County":0.98,"Mahoning County":1.3,"Marion County":0.96,"Medina County":1.18,"Meigs County":0.86,"Mercer County":0.98,"Miami County":1.03,"Monroe County":0.8,"Montgomery County":1.73,"Morgan County":0.81,"Morrow County":1.09,"Muskingum County":0.88,"Noble County":0.64,"Ottawa County":1.01,"Paulding County":0.9,"Perry County":0.87,"Pickaway County":0.92,"Pike County":0.79,"Portage County":1.22,"Preble County":0.98,"Putnam County":0.92,"Richland County":1.19,"Ross County":0.97,"Sandusky County":1.06,"Scioto County":1.08,"Seneca County":0.96,"Shelby County":0.94,"Stark County":1.24,"Summit County":1.49,"Trumbull County":1.32,"Tuscarawas County":1.01,"Union County":1.33,"Van Wert County":0.92,"Vinton County":0.64,"Warren County":1.22,"Washington County":0.9,"Wayne County":1.07,"Williams County":1.13,"Wood County":1.36,"Wyandot County":0.85},"Oklahoma":{"Adair County":0.51,"Alfalfa County":0.56,"Atoka County":0.37,"Beaver County":0.76,"Beckham County":0.82,"Blaine County":0.61,"Bryan County":0.58,"Caddo County":0.55,"Canadian County":0.81,"Carter County":0.66,"Cherokee County":0.49,"Choctaw County":0.39,"Cimarron County":0.51,"Cleveland County":0.92,"Coal County":0.42,"Comanche County":0.68,"Cotton County":0.77,"Craig County":0.42,"Creek County":0.67,"Custer County":0.76,"Delaware County":0.51,"Dewey County":0.65,"Ellis County":0.59,"Garfield County":0.87,"Garvin County":0.49,"Grady County":0.7,"Grant County":0.57,"Greer County":0.46,"Harmon County":0.7,"Harper County":0.7,"Haskell County":0.41,"Hughes County":0.54,"Jackson County":0.64,"Jefferson County":0.56,"Johnston County":0.46,"Kay County":0.66,"Kingfisher County":0.66,"Kiowa County":0.61,"Latimer County":0.49,"Le Flore County":0.59,"Lincoln County":0.38,"Logan County":0.72,"Love County":0.49,"McClain County":0.77,"McCurtain County":0.35,"McIntosh County":0.58,"Major County":0.66,"Marshall County":0.71,"Mayes County":0.6,"Murray County":0.43,"Muskogee County":0.61,"Noble County":0.55,"Nowata County":0.53,"Okfuskee County":0.45,"Oklahoma County":0.92,"Okmulgee County":0.68,"Osage County":0.69,"Ottawa County":0.6,"Pawnee County":0.59,"Payne County":0.77,"Pittsburg County":0.52,"Pontotoc County":0.6,"Pottawatomie County":0.62,"Pushmataha County":0.34,"Roger Mills County":0.39,"Rogers County":0.71,"Seminole County":0.57,"Sequoyah County":0.53,"Stephens County":0.68,"Texas County":0.91,"Tillman County":0.66,"Tulsa County":0.98,"Wagoner County":0.7,"Washington County":0.87,"Washita County":0.51,"Woods County":0.63,"Woodward County":0.6},"Oregon":{"Baker County":0.7,"Benton County":0.93,"Clackamas County":0.84,"Clatsop County":0.66,"Columbia County":0.72,"Coos County":0.67,"Crook County":0.62,"Curry County":0.51,"Deschutes County":0.59,"Douglas County":0.61,"Gilliam County":0.79,"Grant County":0.41,"Harney County":0.71,"Hood River County":0.51,"Jackson County":0.73,"Jefferson County":0.62,"Josephine County":0.5,"Klamath County":0.63,"Lake County":0.58,"Lane County":0.78,"Lincoln County":0.75,"Linn County":0.73,"Malheur County":0.56,"Marion County":0.83,"Morrow County":0.72,"Multnomah County":1.02,"Polk County":0.76,"Sherman County":0.71,"Tillamook County":0.62,"Umatilla County":0.77,"Union County":0.68,"Wallowa County":0.49,"Wasco County":0.77,"Washington County":0.86,"Wheeler County":0.68,"Yamhill County":0.68},"Pennsylvania":{"Adams County":1.22,"Allegheny County":1.47,"Armstrong County":1.36,"Beaver County":1.33,"Bedford County":0.79,"Berks County":1.6,"Blair County":1.05,"Bradford County":1.04,"Bucks County":1.2,"Butler County":0.97,"Cambria County":1.19,"Cameron County":1.31,"Carbon County":1.44,"Centre County":1.04,"Chester County":1.22,"Clarion County":0.91,"Clearfield County":1.07,"Clinton County":1.08,"Columbia County":1.06,"Crawford County":1.24,"Cumberland County":1.11,"Dauphin County":1.28,"Delaware County":1.62,"Elk County":1.15,"Erie County":1.52,"Fayette County":1.08,"Forest County":0.83,"Franklin County":1.03,"Fulton County":0.9,"Greene County":1.11,"Huntingdon County":0.8,"Indiana County":1.33,"Jefferson County":0.85,"Juniata County":0.85,"Lackawanna County":1.4,"Lancaster County":1.2,"Lawrence County":1.25,"Lebanon County":1.23,"Lehigh County":1.42,"Luzerne County":1.35,"Lycoming County":1.24,"McKean County":1.13,"Mercer County":1.06,"Mifflin County":1.22,"Monroe County":1.62,"Montgomery County":1.29,"Montour County":0.92,"Northampton County":1.44,"Northumberland County":1.12,"Perry County":1.07,"Philadelphia County":0.85,"Pike County":1.24,"Potter County":0.98,"Schuylkill County":1.29,"Snyder County":1.02,"Somerset County":0.99,"Sullivan County":0.95,"Susquehanna County":0.91,"Tioga County":1.01,"Union County":1.18,"Venango County":1.22,"Warren County":1.12,"Washington County":1.1,"Wayne County":1.1,"Westmoreland County":1.2,"Wyoming County":1.24,"York County":1.54},"Rhode Island":{"Bristol County":1.14,"Kent County":1.37,"Newport County":0.86,"Providence County":1.19,"Washington County":0.91},"South Carolina":{"Abbeville County":0.42,"Aiken County":0.47,"Allendale County":0.5,"Anderson County":0.5,"Bamberg County":0.71,"Barnwell County":0.6,"Beaufort County":0.5,"Berkeley County":0.49,"Calhoun County":0.36,"Charleston County":0.4,"Cherokee County":0.5,"Chester County":0.5,"Chesterfield County":0.41,"Clarendon County":0.52,"Colleton County":0.54,"Darlington County":0.46,"Dillon County":0.44,"Dorchester County":0.6,"Edgefield County":0.47,"Fairfield County":0.44,"Florence County":0.47,"Georgetown County":0.41,"Greenville County":0.51,"Greenwood County":0.54,"Hampton County":0.63,"Horry County":0.38,"Jasper County":0.55,"Kershaw County":0.51,"Lancaster County":0.54,"Laurens County":0.43,"Lee County":0.49,"Lexington County":0.48,"McCormick County":0.52,"Marion County":0.44,"Marlboro County":0.51,"Newberry County":0.53,"Oconee County":0.38,"Orangeburg County":0.58,"Pickens County":0.43,"Richland County":0.64,"Saluda County":0.43,"Spartanburg County":0.58,"Sumter County":0.54,"Union County":0.43,"Williamsburg County":0.62,"York County":0.53},"South Dakota":{"Aurora County":0.97,"Beadle County":1.01,"Bennett County":0.92,"Bon Homme County":1.1,"Brookings County":1.11,"Brown County":1.07,"Brule County":0.82,"Buffalo County":0.2,"Butte County":0.88,"Campbell County":1.03,"Charles Mix County":0.97,"Clark County":0.76,"Clay County":1.13,"Codington County":0.96,"Corson County":1.18,"Custer County":0.71,"Davison County":1.14,"Day County":0.78,"Deuel County":0.76,"Dewey County":0.95,"Douglas County":0.84,"Edmunds County":0.81,"Fall River County":1.03,"Faulk County":0.75,"Grant County":0.92,"Gregory County":0.76,"Haakon County":0.74,"Hamlin County":1.02,"Hand County":0.8,"Hanson County":0.82,"Harding County":0.98,"Hughes County":1.03,"Hutchinson County":0.91,"Hyde County":1.03,"Jackson County":0.69,"Jerauld County":0.83,"Jones County":0.99,"Kingsbury County":0.93,"Lake County":0.93,"Lawrence County":0.77,"Lincoln County":1.12,"Lyman County":0.96,"McCook County":0.92,"McPherson County":1.1,"Marshall County":0.67,"Meade County":0.91,"Mellette County":0.62,"Miner County":0.7,"Minnehaha County":1.06,"Moody County":0.87,"Pennington County":1.0,"Perkins County":0.97,"Potter County":1.23,"Roberts County":0.69,"Sanborn County":0.59,"Spink County":0.98,"Stanley County":1.11,"Sully County":0.86,"Todd County":0.74,"Tripp County":0.69,"Turner County":1.01,"Union County":1.12,"Walworth County":1.12,"Yankton County":0.99,"Ziebach County":0.62},"Tennessee":{"Anderson County":0.58,"Bedford County":0.54,"Benton County":0.42,"Bledsoe County":0.44,"Blount County":0.48,"Bradley County":0.44,"Campbell County":0.36,"Cannon County":0.41,"Carroll County":0.5,"Carter County":0.49,"Cheatham County":0.48,"Chester County":0.51,"Claiborne County":0.43,"Clay County":0.42,"Cocke County":0.49,"Coffee County":0.55,"Crockett County":0.54,"Cumberland County":0.29,"Davidson County":0.57,"Decatur County":0.41,"DeKalb County":0.34,"Dickson County":0.44,"Dyer County":0.56,"Fayette County":0.33,"Fentress County":0.27,"Franklin County":0.48,"Gibson County":0.61,"Giles County":0.45,"Grainger County":0.41,"Greene County":0.42,"Grundy County":0.43,"Hamblen County":0.37,"Hamilton County":0.62,"Hancock County":0.42,"Hardeman County":0.58,"Hardin County":0.43,"Hawkins County":0.53,"Haywood County":0.6,"Henderson County":0.37,"Henry County":0.38,"Hickman County":0.42,"Houston County":0.52,"Humphreys County":0.41,"Jackson County":0.38,"Jefferson County":0.4,"Johnson County":0.34,"Knox County":0.44,"Lake County":0.72,"Lauderdale County":0.67,"Lawrence County":0.47,"Lewis County":0.32,"Lincoln County":0.41,"Loudon County":0.34,"McMinn County":0.32,"McNairy County":0.38,"Macon County":0.25,"Madison County":0.6,"Marion County":0.39,"Marshall County":0.43,"Maury County":0.43,"Meigs County":0.85,"Monroe County":0.39,"Montgomery County":0.61,"Moore County":0.42,"Morgan County":0.41,"Obion County":0.49,"Overton County":0.36,"Perry County":0.5,"Pickett County":0.12,"Polk County":0.45,"Putnam County":0.48,"Rhea County":0.52,"Roane County":0.55,"Robertson County":0.44,"Rutherford County":0.48,"Scott County":0.41,"Sequatchie County":0.41,"Sevier County":0.31,"Shelby County":0.97,"Smith County":0.43,"Stewart County":0.43,"Sullivan County":0.59,"Sumner County":0.46,"Tipton County":0.56,"Trousdale County":0.38,"Unicoi County":0.49,"Union County":0.27,"Van Buren County":0.44,"Warren County":0.43,"Washington County":0.56,"Wayne County":0.39,"Weakley County":0.44,"White County":0.44,"Williamson County":0.37,"Wilson County":0.42},"Texas":{"Anderson County":0.91,"Andrews County":1.13,"Angelina County":1.13,"Aransas County":1.01,"Archer County":1.29,"Armstrong County":1.06,"Atascosa County":1.15,"Austin County":1.0,"Bailey County":0.74,"Bandera County":0.81,"Bastrop County":1.17,"Baylor County":0.54,"Bee County":1.25,"Bell County":1.21,"Bexar County":1.55,"Blanco County":1.02,"Borden County":0.22,"Bosque County":0.86,"Bowie County":1.17,"Brazoria County":1.69,"Brazos County":1.38,"Brewster County":0.98,"Briscoe County":0.74,"Brooks County":1.15,"Brown County":1.13,"Burleson County":1.01,"Burnet County":0.94,"Caldwell County":1.05,"Calhoun County":1.0,"Callahan County":0.78,"Cameron County":1.35,"Camp County":0.98,"Carson County":1.36,"Cass County":0.67,"Castro County":1.2,"Chambers County":1.01,"Cherokee County":0.95,"Childress County":1.4,"Clay County":1.01,"Cochran County":1.01,"Coke County":0.94,"Coleman County":0.94,"Collin County":1.48,"Collingsworth County":0.91,"Colorado County":0.77,"Comal County":1.04,"Comanche County":0.98,"Concho County":0.99,"Cooke County":1.06,"Coryell County":1.0,"Cottle County":1.15,"Crane County":0.95,"Crockett County":1.24,"Crosby County":1.16,"Culberson County":1.14,"Dallam County":1.2,"Dallas County":1.45,"Dawson County":1.46,"Deaf Smith County":1.45,"Delta County":1.16,"Denton County":1.46,"DeWitt County":0.86,"Dickens County":0.92,"Dimmit County":0.82,"Donley County":0.76,"Duval County":0.99,"Eastland County":0.99,"Ector County":1.27,"Edwards County":0.66,"Ellis County":1.24,"El Paso County":1.8,"Erath County":0.88,"Falls County":0.97,"Fannin County":0.86,"Fayette County":0.73,"Fisher County":1.01,"Floyd County":1.45,"Foard County":1.34,"Fort Bend County":1.77,"Franklin County":0.81,"Freestone County":0.98,"Frio County":1.33,"Gaines County":1.5,"Galveston County":1.4,"Garza County":1.33,"Gillespie County":0.83,"Glasscock County":0.6,"Goliad County":0.95,"Gonzales County":0.91,"Gray County":1.44,"Grayson County":1.23,"Gregg County":1.16,"Grimes County":0.9,"Guadalupe County":1.19,"Hale County":1.3,"Hall County":1.18,"Hamilton County":0.81,"Hansford County":1.43,"Hardeman County":0.86,"Hardin County":1.16,"Harris County":1.5,"Harrison County":0.96,"Hartley County":1.08,"Haskell County":0.96,"Hays County":1.4,"Hemphill County":1.24,"Henderson County":0.98,"Hidalgo County":1.63,"Hill County":1.05,"Hockley County":0.94,"Hood County":0.97,"Hopkins County":0.68,"Houston County":0.75,"Howard County":1.11,"Hudspeth County":0.95,"Hunt County":1.18,"Hutchinson County":1.45,"Irion County":1.17,"Jack County":0.84,"Jackson County":1.06,"Jasper County":0.89,"Jeff Davis County":0.51,"Jefferson County":1.5,"Jim Hogg County":1.34,"Jim Wells County":1.21,"Johnson County":1.19,"Jones County":1.2,"Karnes County":0.61,"Kaufman County":1.49,"Kendall County":1.0,"Kenedy County":0.81,"Kent County":0.52,"Kerr County":0.89,"Kimble County":0.88,"Kinney County":1.25,"Kleberg County":1.44,"Knox County":1.54,"Lamar County":0.88,"Lamb County":1.12,"Lampasas County":0.76,"La Salle County":1.26,"Lavaca County":0.76,"Lee County":0.88,"Leon County":0.62,"Liberty County":1.2,"Limestone County":0.94,"Lipscomb County":1.35,"Live Oak County":0.75,"Llano County":0.68,"Lubbock County":1.5,"Lynn County":1.33,"McCulloch County":1.05,"McLennan County":1.36,"McMullen County":0.84,"Madison County":0.96,"Marion County":0.9,"Martin County":0.72,"Mason County":0.64,"Matagorda County":1.22,"Maverick County":1.33,"Medina County":1.23,"Menard County":1.13,"Midland County":1.19,"Milam County":0.92,"Mills County":0.67,"Mitchell County":1.68,"Montague County":0.88,"Montgomery County":1.44,"Moore County":1.35,"Morris County":0.96,"Motley County":0.96,"Nacogdoches County":0.86,"Navarro County":1.05,"Newton County":0.87,"Nolan County":1.4,"Nueces County":1.4,"Ochiltree County":1.44,"Oldham County":1.14,"Orange County":1.23,"Palo Pinto County":1.07,"Panola County":0.88,"Parker County":1.27,"Parmer County":1.24,"Pecos County":0.8,"Polk County":0.92,"Potter County":1.41,"Presidio County":1.02,"Rains County":1.12,"Randall County":1.37,"Reagan County":0.86,"Real County":0.71,"Red River County":0.74,"Reeves County":0.97,"Refugio County":1.09,"Roberts County":0.93,"Robertson County":0.69,"Rockwall County":1.42,"Runnels County":1.38,"Rusk County":0.91,"Sabine County":0.79,"San Augustine County":0.52,"San Jacinto County":0.94,"San Patricio County":1.31,"San Saba County":0.58,"Schleicher County":1.06,"Scurry County":1.36,"Shackelford County":1.2,"Shelby County":0.64,"Sherman County":1.59,"Smith County":1.15,"Somervell County":0.65,"Starr County":1.22,"Stephens County":1.14,"Sterling County":0.89,"Stonewall County":1.46,"Sutton County":1.59,"Swisher County":1.39,"Tarrant County":1.54,"Taylor County":1.25,"Terrell County":0.96,"Terry County":1.45,"Throckmorton County":1.0,"Titus County":1.1,"Tom Green County":1.29,"Travis County":1.31,"Trinity County":0.98,"Tyler County":0.97,"Upshur County":1.09,"Upton County":1.07,"Uvalde County":1.16,"Val Verde County":1.31,"Van Zandt County":0.84,"Victoria County":1.42,"Walker County":1.06,"Waller County":1.27,"Ward County":0.33,"Washington County":0.79,"Webb County":1.58,"Wharton County":1.31,"Wheeler County":1.44,"Wichita County":1.55,"Wilbarger County":1.48,"Willacy County":1.46,"Williamson County":1.5,"Wilson County":1.2,"Winkler County":0.76,"Wise County":1.09,"Wood County":0.73,"Yoakum County":1.12,"Young County":1.18,"Zapata County":0.69,"Zavala County":1.3},"Utah":{"Beaver County":0.36,"Box Elder County":0.47,"Cache County":0.46,"Carbon County":0.62,"Daggett County":0.53,"Davis County":0.51,"Duchesne County":0.56,"Emery County":0.62,"Garfield County":0.27,"Grand County":0.4,"Iron County":0.43,"Juab County":0.37,"Kane County":0.41,"Millard County":0.5,"Morgan County":0.52,"Piute County":0.32,"Rich County":0.34,"Salt Lake County":0.5,"San Juan County":0.39,"Sanpete County":0.47,"Sevier County":0.49,"Summit County":0.32,"Tooele County":0.54,"Uintah County":0.49,"Utah County":0.43,"Wasatch County":0.49,"Washington County":0.41,"Wayne County":0.38,"Weber County":0.56},"Vermont":{"Addison County":1.47,"Bennington County":1.5,"Caledonia County":1.61,"Chittenden County":1.44,"Essex County":1.45,"Franklin County":1.4,"Grand Isle County":1.33,"Lamoille County":1.39,"Orange County":1.53,"Orleans County":1.43,"Rutland County":1.65,"Washington County":1.64,"Windham County":1.6,"Windsor County":1.64},"Virginia":{"Accomack County":0.5,"Albemarle County":0.73,"Alleghany County":0.68,"Amelia County":0.43,"Amherst County":0.47,"Appomattox County":0.52,"Arlington County":0.85,"Augusta County":0.47,"Bath County":0.43,"Bedford County":0.43,"Bland County":0.55,"Botetourt County":0.6,"Brunswick County":0.4,"Buchanan County":0.48,"Buckingham County":0.48,"Campbell County":0.46,"Caroline County":0.5,"Carroll County":0.54,"Charles City County":0.59,"Charlotte County":0.5,"Chesterfield County":0.75,"Clarke County":0.59,"Craig County":0.58,"Culpeper County":0.5,"Cumberland County":0.53,"Dickenson County":0.51,"Dinwiddie County":0.58,"Essex County":0.58,"Fairfax County":0.95,"Fauquier County":0.67,"Floyd County":0.46,"Fluvanna County":0.65,"Franklin County":0.5,"Frederick County":0.5,"Giles County":0.54,"Gloucester County":0.56,"Goochland County":0.52,"Grayson County":0.62,"Greene County":0.61,"Greensville County":0.6,"Halifax County":0.5,"Hanover County":0.66,"Henrico County":0.68,"Henry County":0.48,"Highland County":0.69,"Isle of Wight County":0.72,"James City County":0.61,"King and Queen County":0.45,"King George County":0.55,"King William County":0.61,"Lancaster County":0.49,"Lee County":0.61,"Loudoun County":0.8,"Louisa County":0.63,"Lunenburg County":0.4,"Madison County":0.49,"Mathews County":0.49,"Mecklenburg County":0.5,"Middlesex County":0.51,"Montgomery County":0.82,"Nelson County":0.56,"New Kent County":0.6,"Northampton County":0.66,"Northumberland County":0.46,"Nottoway County":0.43,"Orange County":0.59,"Page County":0.49,"Patrick County":0.58,"Pittsylvania County":0.57,"Powhatan County":0.59,"Prince Edward County":0.52,"Prince George County":0.69,"Prince William County":0.85,"Pulaski County":0.63,"Rappahannock County":0.49,"Richmond County":0.5,"Roanoke County":0.79,"Rockbridge County":0.59,"Rockingham County":0.55,"Russell County":0.48,"Scott County":0.68,"Shenandoah County":0.53,"Smyth County":0.54,"Southampton County":0.76,"Spotsylvania County":0.56,"Stafford County":0.67,"Surry County":0.67,"Sussex County":0.56,"Tazewell County":0.61,"Warren County":0.52,"Washington County":0.5,"Westmoreland County":0.62,"Wise County":0.59,"Wythe County":0.52,"York County":0.63,"Alexandria city":0.92,"Bristol city":0.72,"Buena Vista city":0.88,"Charlottesville city":0.82,"Chesapeake city":0.78,"Colonial Heights city":0.75,"Covington city":0.86,"Danville city":0.62,"Emporia city":0.7,"Fairfax city":0.85,"Falls Church city":1.15,"Franklin city":0.81,"Fredericksburg city":0.65,"Galax city":0.52,"Hampton city":0.97,"Harrisonburg city":0.74,"Hopewell city":0.88,"Lexington city":0.85,"Lynchburg city":0.81,"Manassas city":0.99,"Manassas Park city":1.08,"Martinsville city":0.81,"Newport News city":0.94,"Norfolk city":0.91,"Norton city":0.85,"Petersburg city":0.87,"Poquoson city":0.9,"Portsmouth city":0.95,"Radford city":0.7,"Richmond city":0.9,"Roanoke city":0.95,"Salem city":0.82,"Staunton city":0.6,"Suffolk city":0.87,"Virginia Beach city":0.78,"Waynesboro city":0.66,"Williamsburg city":0.61,"Winchester city":0.74},"Washington":{"Adams County":0.72,"Asotin County":0.72,"Benton County":0.76,"Chelan County":0.65,"Clallam County":0.68,"Clark County":0.77,"Columbia County":0.74,"Cowlitz County":0.81,"Douglas County":0.76,"Ferry County":0.57,"Franklin County":0.74,"Garfield County":0.96,"Grant County":0.74,"Grays Harbor County":0.71,"Island County":0.66,"Jefferson County":0.65,"King County":0.76,"Kitsap County":0.72,"Kittitas County":0.66,"Klickitat County":0.62,"Lewis County":0.68,"Lincoln County":0.6,"Mason County":0.72,"Okanogan County":0.64,"Pacific County":0.71,"Pend Oreille County":0.56,"Pierce County":0.85,"San Juan County":0.53,"Skagit County":0.75,"Skamania County":0.56,"Snohomish County":0.72,"Spokane County":0.78,"Stevens County":0.61,"Thurston County":0.82,"Wahkiakum County":0.59,"Walla Walla County":0.85,"Whatcom County":0.68,"Whitman County":0.77,"Yakima County":0.79},"West Virginia":{"Barbour County":0.36,"Berkeley County":0.53,"Boone County":0.51,"Braxton County":0.39,"Brooke County":0.55,"Cabell County":0.62,"Calhoun County":0.29,"Clay County":0.59,"Doddridge County":0.48,"Fayette County":0.55,"Gilmer County":0.47,"Grant County":0.33,"Greenbrier County":0.44,"Hampshire County":0.29,"Hancock County":0.56,"Hardy County":0.29,"Harrison County":0.56,"Jackson County":0.52,"Jefferson County":0.52,"Kanawha County":0.63,"Lewis County":0.42,"Lincoln County":0.41,"Logan County":0.43,"McDowell County":0.4,"Marion County":0.61,"Marshall County":0.5,"Mason County":0.41,"Mercer County":0.48,"Mineral County":0.43,"Mingo County":0.4,"Monongalia County":0.45,"Monroe County":0.53,"Morgan County":0.4,"Nicholas County":0.41,"Ohio County":0.61,"Pendleton County":0.32,"Pleasants County":0.62,"Pocahontas County":0.35,"Preston County":0.46,"Putnam County":0.59,"Raleigh County":0.49,"Randolph County":0.39,"Ritchie County":0.48,"Roane County":0.31,"Summers County":0.4,"Taylor County":0.44,"Tucker County":0.34,"Tyler County":0.52,"Upshur County":0.39,"Wayne County":0.48,"Webster County":0.31,"Wetzel County":0.57,"Wirt County":0.47,"Wood County":0.55,"Wyoming County":0.38},"Wisconsin":{"Adams County":1.21,"Ashland County":1.3,"Barron County":1.22,"Bayfield County":0.92,"Brown County":1.3,"Buffalo County":1.04,"Burnett County":0.88,"Calumet County":1.35,"Chippewa County":0.98,"Clark County":1.2,"Columbia County":1.27,"Crawford County":1.12,"Dane County":1.57,"Dodge County":1.22,"Door County":0.97,"Douglas County":1.13,"Dunn County":1.25,"Eau Claire County":1.27,"Florence County":1.25,"Fond du Lac County":1.35,"Forest County":0.9,"Grant County":1.2,"Green County":1.41,"Green Lake County":1.08,"Iowa County":1.31,"Iron County":0.98,"Jackson County":1.16,"Jefferson County":1.22,"Juneau County":1.27,"Kenosha County":1.42,"Kewaunee County":1.27,"La Crosse County":1.46,"Lafayette County":1.24,"Langlade County":1.07,"Lincoln County":1.16,"Manitowoc County":1.31,"Marathon County":1.35,"Marinette County":1.11,"Marquette County":1.15,"Menominee County":1.07,"Milwaukee County":1.82,"Monroe County":1.25,"Oconto County":1.05,"Oneida County":0.84,"Outagamie County":1.34,"Ozaukee County":1.17,"Pepin County":1.17,"Pierce County":1.3,"Polk County":1.07,"Portage County":1.28,"Price County":1.17,"Racine County":1.44,"Richland County":1.09,"Rock County":1.49,"Rusk County":1.03,"St. Croix County":1.1,"Sauk County":1.23,"Sawyer County":0.77,"Shawano County":1.19,"Sheboygan County":1.23,"Taylor County":1.3,"Trempealeau County":1.32,"Vernon County":1.14,"Vilas County":0.69,"Walworth County":1.17,"Washburn County":0.98,"Washington County":1.06,"Waukesha County":1.11,"Waupaca County":1.26,"Waushara County":1.11,"Winnebago County":1.43,"Wood County":1.36},"Wyoming":{"Albany County":0.58,"Big Horn County":0.44,"Campbell County":0.51,"Carbon County":0.55,"Converse County":0.53,"Crook County":0.44,"Fremont County":0.53,"Goshen County":0.59,"Hot Springs County":0.62,"Johnson County":0.53,"Laramie County":0.56,"Lincoln County":0.48,"Natrona County":0.57,"Niobrara County":0.26,"Park County":0.6,"Platte County":0.45,"Sheridan County":0.56,"Sublette County":0.38,"Sweetwater County":0.63,"Teton County":0.45,"Uinta County":0.47,"Washakie County":0.72,"Weston County":0.63}};

const ALL_STATES = Object.keys(TAX_DATA).sort();

// ── Price per sqft lookup (county_price_per_sqft_simplified.csv) ─────────────
// Keys are title-case county names WITHOUT "County" suffix, state as full name
// e.g. PPSF_DATA["Arkansas"]["Greene"] = 134
const PPSF_DATA = {"Mississippi":{"Marshall":167,"Smith":108,"Grenada":105,"Franklin":133,"Wilkinson":107,"Lee":150,"Tunica":128,"Hinds":86,"Clarke":115,"Sunflower":85,"Pearl River":155,"Tishomingo":158,"Harrison":167,"George":155,"Tate":165,"Leflore":96,"Union":168,"Carroll":126,"Yazoo":91,"Benton":135,"Clay":113,"Lawrence":80,"Claiborne":73,"Stone":160,"Hancock":210,"Prentiss":111,"Forrest":127,"Panola":136,"Lincoln":113,"Coahoma":82,"Winston":100,"Holmes":81,"Yalobusha":139,"Lamar":169,"Kemper":95,"Covington":109,"Pike":95,"Pontotoc":159,"Newton":85,"Bolivar":101,"Attala":87,"Lafayette":286,"Simpson":130,"Desoto":168,"Tippah":114,"Webster":121,"Scott":104,"Sharkey":76,"Perry":149,"Calhoun":95,"Amite":90,"Jefferson":204,"Tallahatchie":75,"Warren":112,"Greene":128,"Jefferson Davis":82,"Alcorn":114,"Walthall":119,"Washington":84,"Madison":191,"Adams":120,"Copiah":106,"Lowndes":132,"Lauderdale":102,"Montgomery":90,"Neshoba":116,"Wayne":82,"Choctaw":103,"Jones":127,"Itawamba":130,"Noxubee":99,"Monroe":116,"Chickasaw":101,"Quitman":64,"Rankin":170,"Leake":115,"Marion":102,"Jasper":126,"Jackson":152,"Oktibbeha":206,"Humphreys":71},"Louisiana":{"Bossier":161,"Winn":63,"Pointe Coupee":175,"Assumption":136,"Jackson":125,"Claiborne":102,"Webster":102,"Madison":75,"Iberia":103,"Evangeline":66,"Avoyelles":89,"Lafourche":140,"De Soto":171,"Plaquemines":169,"Iberville":132,"St. Helena":151,"East Feliciana":165,"Tensas":311,"Orleans":222,"St. John The Baptist":134,"Morehouse":82,"Cameron":223,"Lafayette":163,"East Baton Rouge":160,"Natchitoches":152,"Caddo":107,"West Baton Rouge":155,"St. Tammany":168,"Bienville":79,"Acadia":117,"West Carroll":94,"West Feliciana":218,"Rapides":120,"Lincoln":152,"Washington":115,"Livingston":163,"Concordia":120,"Union":125,"Ouachita":134,"St. Bernard":159,"Lasalle":120,"Caldwell":106,"Grant":148,"Ascension":179,"Jefferson":171,"St. James":129,"Terrebonne":138,"Vernon":114,"Beauregard":128,"Sabine":192,"Richland":164,"Allen":84,"Franklin":92,"St. Landry":109,"East Carroll":74,"Jefferson Davis":97,"St. Mary":109,"Red River":89,"St. Charles":155,"Calcasieu":125,"St. Martin":139,"Vermilion":113,"Catahoula":111,"Tangipahoa":151},"Texas":{"Lee":199,"Wharton":134,"Runnels":94,"Victoria":159,"Kerr":247,"Kinney":132,"Menard":109,"Williamson":204,"Johnson":182,"Smith":185,"Brazoria":172,"Bastrop":213,"Jeff Davis":231,"Crockett":141,"Bexar":161,"Crane":125,"Brown":153,"Dickens":47,"Franklin":211,"Collingsworth":65,"Briscoe":64,"Taylor":190,"Terry":102,"Collin":213,"Montgomery":175,"San Saba":181,"Tom Green":174,"Donley":106,"Starr":137,"Carson":125,"Shackelford":175,"Haskell":85,"Bee":137,"Pecos":130,"Motley":40,"Hockley":122,"Freestone":138,"Bosque":184,"Bowie":135,"Jim Wells":147,"Kaufman":167,"San Jacinto":184,"Colorado":169,"Archer":145,"Val Verde":158,"Orange":126,"Fannin":190,"Webb":160,"Hardeman":75,"Denton":209,"Mills":185,"Rains":205,"Dewitt":142,"Cass":139,"Nueces":204,"Mclennan":179,"Hansford":58,"Cameron":179,"Randall":173,"Mcculloch":124,"Live Oak":160,"Deaf Smith":120,"Montague":177,"Llano":354,"Cooke":195,"Rockwall":194,"Navarro":170,"Hardin":151,"Mcmullen":116,"Wilson":226,"Lamar":136,"Grimes":212,"Camp":180,"Titus":168,"Brazos":200,"Rusk":148,"Knox":68,"Robertson":197,"Hemphill":92,"Dimmit":109,"Comanche":154,"Sabine":185,"Zavala":112,"Lipscomb":88,"Shelby":129,"Lubbock":142,"Wichita":119,"Floyd":82,"Houston":153,"Hunt":173,"Hartley":150,"Oldham":147,"Matagorda":181,"Parker":226,"Brooks":93,"Throckmorton":90,"Erath":215,"Karnes":132,"Gillespie":380,"Crosby":64,"Wheeler":93,"Marion":162,"Scurry":91,"Refugio":155,"Fort Bend":173,"Comal":235,"Morris":126,"Baylor":117,"Milam":166,"Howard":124,"Stonewall":96,"Henderson":202,"Harrison":151,"Irion":173,"Stephens":136,"Kendall":279,"El Paso":171,"Hudspeth":176,"San Patricio":173,"Falls":102,"Mitchell":72,"Somervell":217,"Coryell":151,"Hamilton":165,"Swisher":82,"Culberson":123,"Midland":194,"Hopkins":173,"Upton":113,"Caldwell":181,"Dallas":214,"Hill":174,"Lynn":163,"Wood":180,"Lavaca":155,"Presidio":310,"Kleberg":128,"Wilbarger":89,"Wise":215,"Angelina":151,"Galveston":268,"Aransas":307,"Burleson":184,"Real":264,"Winkler":134,"Atascosa":173,"Garza":90,"Bell":161,"Van Zandt":190,"Duval":95,"Limestone":154,"Zapata":101,"Mason":183,"Washington":208,"Austin":197,"Jefferson":129,"Tarrant":190,"Hutchinson":98,"Blanco":320,"Hood":200,"Brewster":201,"Callahan":144,"Coke":172,"Lamb":100,"Foard":29,"Dallam":138,"Fisher":118,"Edwards":326,"Leon":173,"Gray":86,"Gonzales":167,"Jackson":144,"Chambers":174,"Andrews":161,"Bailey":103,"Red River":110,"Newton":130,"Moore":131,"Cherokee":175,"Yoakum":127,"Childress":120,"Grayson":188,"La Salle":73,"Martin":222,"Fayette":201,"Kimble":175,"Roberts":80,"Sherman":106,"Uvalde":219,"Willacy":183,"Schleicher":97,"Parmer":117,"Clay":141,"Reeves":151,"Frio":133,"Ochiltree":87,"Jim Hogg":75,"Dawson":107,"Hidalgo":158,"Upshur":160,"Tyler":149,"Castro":114,"Sutton":108,"Burnet":275,"Nacogdoches":164,"Calhoun":235,"Armstrong":149,"Liberty":158,"Hall":63,"Nolan":113,"Concho":123,"Ward":160,"Terrell":122,"Delta":142,"Polk":175,"Coleman":112,"Hays":208,"Palo Pinto":268,"Trinity":148,"Medina":194,"Panola":164,"Goliad":175,"Waller":175,"Ector":162,"Maverick":192,"Guadalupe":158,"Harris":166,"Gaines":163,"Hale":100,"Gregg":151,"Lampasas":200,"Sterling":159,"Travis":319,"Madison":195,"Anderson":145,"Jasper":143,"Eastland":123,"Bandera":252,"Kent":122,"Potter":139,"Reagan":116,"Jack":148,"San Augustine":202,"Young":155,"Jones":123,"Ellis":193,"Walker":173,"Cottle":41},"New York":{"Nassau":544,"Albany":236,"Delaware":207,"Suffolk":523,"Chenango":109,"Broome":125,"Oswego":148,"Herkimer":123,"Kings":773,"Allegany":103,"Greene":278,"Schoharie":194,"Schuyler":149,"Bronx":341,"Niagara":153,"Warren":290,"Clinton":154,"Oneida":161,"Ontario":243,"Wyoming":142,"Chemung":109,"Wayne":184,"New York":1484,"Rensselaer":216,"Monroe":183,"Erie":194,"Saratoga":328,"Richmond":474,"Sullivan":269,"Onondaga":199,"Madison":193,"Otsego":166,"Orleans":117,"Hamilton":248,"Chautauqua":123,"Fulton":169,"Franklin":126,"Lewis":159,"Tioga":127,"Cayuga":170,"Yates":354,"Washington":186,"Steuben":117,"Seneca":138,"Livingston":125,"Tompkins":223,"Queens":608,"Essex":211,"Schenectady":209,"Rockland":382,"Ulster":308,"Dutchess":295,"Westchester":415,"Genesee":152,"Montgomery":132,"Cortland":121,"Jefferson":146,"St. Lawrence":112,"Cattaraugus":125,"Columbia":333,"Putnam":338,"Orange":273},"Michigan":{"Kalkaska":209,"Presque Isle":224,"Luce":124,"Clare":159,"Mason":203,"Gladwin":176,"Allegan":266,"Delta":176,"Kent":219,"Mecosta":178,"Marquette":271,"Gratiot":127,"Antrim":265,"Wayne":122,"Emmet":473,"Hillsdale":178,"Clinton":192,"Cass":217,"Livingston":245,"Alger":249,"Van Buren":200,"Montmorency":142,"Baraga":223,"Berrien":226,"Cheboygan":210,"Barry":210,"Oceana":203,"Ingham":135,"Montcalm":186,"Missaukee":194,"Gogebic":125,"Oakland":232,"Manistee":211,"Macomb":187,"Midland":179,"Menominee":134,"Otsego":156,"Ottawa":242,"Jackson":154,"Iosco":151,"Ionia":182,"Ogemaw":150,"Monroe":192,"Crawford":192,"Ontonagon":145,"Muskegon":194,"Mackinac":240,"Charlevoix":333,"Genesee":139,"St. Clair":193,"Arenac":158,"Lake":189,"Roscommon":192,"Newaygo":199,"Washtenaw":249,"Calhoun":145,"Saginaw":103,"Chippewa":173,"Benzie":339,"Leelanau":357,"Sanilac":190,"Schoolcraft":183,"Alpena":143,"Kalamazoo":167,"Isabella":138,"Alcona":175,"Branch":199,"Lenawee":174,"Huron":161,"Shiawassee":151,"Dickinson":153,"Oscoda":144,"St. Joseph":156,"Houghton":164,"Tuscola":145,"Bay":140,"Osceola":156,"Wexford":168,"Lapeer":229,"Eaton":153,"Keweenaw":251,"Iron":152,"Grand Traverse":321},"Nebraska":{"Pierce":174,"Saunders":182,"Valley":147,"Furnas":87,"Dundy":84,"Hooker":179,"Box Butte":114,"Boone":157,"Colfax":161,"Cedar":111,"Thurston":223,"Red Willow":121,"Harlan":123,"Garden":151,"Adams":119,"Cuming":172,"Washington":198,"Dixon":99,"Lancaster":184,"Otoe":154,"Keith":145,"Hamilton":126,"Rock":150,"Douglas":184,"Nance":116,"Holt":180,"Cass":202,"Hayes":132,"Wayne":121,"Gage":131,"Dawes":131,"Pawnee":95,"Dakota":166,"Jefferson":105,"Merrick":122,"Morrill":141,"Brown":152,"Thayer":113,"Fillmore":113,"York":133,"Stanton":151,"Butler":169,"Howard":128,"Gosper":230,"Deuel":112,"Custer":80,"Phelps":123,"Saline":138,"Kearney":99,"Scotts Bluff":171,"Platte":224,"Knox":116,"Nemaha":125,"Logan":76,"Hall":136,"Banner":194,"Polk":82,"Dawson":138,"Franklin":89,"Dodge":165,"Greeley":149,"Cherry":115,"Loup":192,"Sheridan":71,"Sarpy":188,"Lincoln":183,"Seward":157,"Clay":96,"Burt":131,"Garfield":209,"Chase":119,"Madison":153,"Richardson":74,"Nuckolls":95,"Webster":113,"Boyd":87,"Buffalo":151,"Sherman":102,"Perkins":112,"Frontier":74,"Kimball":126,"Hitchcock":90,"Johnson":160,"Cheyenne":108,"Antelope":109},"Ohio":{"Monroe":106,"Pike":168,"Franklin":202,"Noble":87,"Scioto":135,"Warren":209,"Belmont":116,"Seneca":136,"Mercer":173,"Athens":153,"Morgan":114,"Pickaway":185,"Defiance":129,"Medina":180,"Miami":173,"Henry":126,"Adams":154,"Guernsey":130,"Champaign":167,"Williams":142,"Holmes":149,"Clark":153,"Coshocton":124,"Stark":141,"Hardin":124,"Allen":129,"Richland":156,"Shelby":180,"Montgomery":143,"Lorain":169,"Clermont":198,"Butler":183,"Paulding":124,"Huron":143,"Clinton":195,"Ashtabula":165,"Sandusky":124,"Meigs":117,"Brown":197,"Delaware":220,"Lucas":129,"Morrow":212,"Gallia":151,"Fulton":157,"Darke":139,"Hocking":283,"Columbiana":128,"Portage":161,"Auglaize":168,"Fairfield":194,"Highland":164,"Wood":184,"Wayne":170,"Summit":140,"Geauga":190,"Ottawa":296,"Carroll":175,"Fayette":157,"Tuscarawas":146,"Crawford":116,"Knox":181,"Jackson":144,"Logan":209,"Hamilton":186,"Ross":165,"Hancock":155,"Harrison":118,"Vinton":292,"Van Wert":130,"Ashland":152,"Trumbull":126,"Washington":136,"Wyandot":129,"Marion":141,"Union":220,"Licking":211,"Erie":204,"Mahoning":124,"Lawrence":126,"Putnam":128,"Muskingum":147,"Lake":167,"Preble":156,"Jefferson":124,"Greene":176,"Madison":202,"Perry":188,"Cuyahoga":142},"South Dakota":{"Brule":181,"Hutchinson":112,"Mcpherson":56,"Bennett":185,"Stanley":256,"Minnehaha":202,"Walworth":150,"Clay":174,"Sully":268,"Roberts":121,"Lincoln":211,"Butte":196,"Hughes":269,"Codington":161,"Faulk":84,"Mccook":191,"Hamlin":202,"Turner":165,"Yankton":185,"Lyman":138,"Meade":267,"Potter":81,"Hand":140,"Kingsbury":206,"Gregory":172,"Custer":353,"Perkins":106,"Fall River":220,"Corson":127,"Union":177,"Lawrence":317,"Haakon":490,"Deuel":129,"Jones":138,"Jackson":104,"Grant":111,"Marshall":122,"Lake":255,"Harding":143,"Edmunds":70,"Day":103,"Douglas":91,"Beadle":100,"Hyde":66,"Bon Homme":128,"Hanson":164,"Todd":100,"Miner":123,"Brown":138,"Davison":201,"Jerauld":137,"Moody":195,"Spink":81,"Sanborn":150,"Charles Mix":218,"Clark":113,"Tripp":203,"Pennington":256,"Brookings":181,"Aurora":131},"Iowa":{"Davis":121,"Harrison":150,"Webster":111,"Greene":116,"Louisa":135,"Black Hawk":143,"Van Buren":185,"Benton":136,"Jasper":172,"Mitchell":146,"Grundy":131,"Butler":109,"Polk":220,"Guthrie":244,"Muscatine":138,"Dallas":260,"Keokuk":87,"Cass":116,"Floyd":84,"Henry":126,"Iowa":121,"Sac":142,"Osceola":121,"Appanoose":149,"Crawford":126,"Cedar":158,"Dickinson":312,"Linn":162,"Cerro Gordo":179,"Palo Alto":94,"Taylor":95,"Cherokee":93,"Adams":80,"Des Moines":100,"Winnebago":108,"Sioux":165,"Hamilton":124,"Boone":167,"Allamakee":181,"Dubuque":188,"Buena Vista":132,"Page":113,"Kossuth":121,"Franklin":92,"Wayne":113,"Lee":88,"Tama":107,"Shelby":114,"Montgomery":98,"Clinton":111,"Hardin":112,"Audubon":186,"Pocahontas":102,"Union":110,"Lucas":133,"Wright":105,"Plymouth":162,"Clayton":130,"Worth":87,"Fayette":84,"Emmet":100,"O'Brien":128,"Scott":175,"Winneshiek":164,"Jefferson":121,"Johnson":197,"Marshall":124,"Pottawattamie":170,"Ida":90,"Bremer":143,"Fremont":124,"Buchanan":147,"Carroll":141,"Chickasaw":112,"Story":224,"Jones":128,"Monroe":105,"Monona":134,"Delaware":180,"Adair":135,"Mills":170,"Madison":214,"Warren":239,"Ringgold":226,"Clay":116,"Decatur":131,"Woodbury":143,"Mahaska":154,"Poweshiek":165,"Clarke":144,"Washington":151,"Lyon":153,"Marion":233,"Howard":112,"Hancock":131,"Humboldt":121,"Wapello":123,"Jackson":144,"Calhoun":122},"California":{"Riverside":339,"Yolo":393,"El Dorado":359,"San Diego":605,"Plumas":288,"Inyo":334,"Ventura":546,"Orange":731,"Sutter":265,"Lake":240,"San Mateo":939,"Stanislaus":300,"San Francisco":980,"Glenn":269,"Mendocino":390,"Mariposa":283,"Alpine":434,"Tulare":248,"Siskiyou":229,"Madera":256,"Del Norte":267,"Solano":342,"Kings":239,"Sacramento":330,"Napa":661,"Shasta":254,"Yuba":279,"Nevada":321,"Fresno":263,"San Luis Obispo":592,"Lassen":171,"Imperial":244,"Tuolumne":255,"Trinity":219,"Tehama":252,"San Joaquin":308,"Santa Clara":868,"Placer":362,"Santa Barbara":920,"Contra Costa":492,"Sierra":255,"Monterey":714,"Merced":266,"Butte":271,"San Bernardino":331,"Mono":657,"Calaveras":296,"Amador":290,"Colusa":252,"Kern":234,"Modoc":174,"San Benito":431,"Alameda":616,"Los Angeles":637,"Sonoma":559,"Humboldt":309,"Santa Cruz":718,"Marin":760},"Tennessee":{"Pickett":256,"Hardin":192,"Humphreys":194,"Overton":194,"Davidson":307,"Blount":246,"White":217,"Macon":201,"Smith":230,"Carter":203,"Fentress":215,"Marshall":221,"Unicoi":191,"Marion":256,"Henderson":169,"Carroll":148,"Hickman":248,"Gibson":141,"Greene":208,"Hancock":201,"Union":248,"Wayne":176,"Scott":176,"Loudon":262,"Lake":105,"Coffee":209,"Putnam":207,"Obion":135,"Hawkins":202,"Montgomery":194,"Grundy":240,"Claiborne":192,"Roane":200,"Robertson":220,"Franklin":223,"Stewart":205,"Clay":216,"Cumberland":218,"Rutherford":226,"Houston":178,"Decatur":175,"Hamblen":199,"Grainger":230,"Jefferson":239,"Perry":194,"Benton":159,"Rhea":206,"Hamilton":220,"Van Buren":230,"Wilson":236,"Mcminn":182,"Crockett":164,"Jackson":214,"Madison":163,"Shelby":145,"Mcnairy":135,"Chester":155,"Cannon":248,"Washington":216,"Lauderdale":137,"Lewis":203,"Campbell":218,"Sumner":231,"Moore":245,"Hardeman":136,"Dekalb":233,"Trousdale":231,"Dickson":253,"Cheatham":231,"Meigs":243,"Polk":220,"Giles":202,"Warren":207,"Haywood":141,"Sequatchie":224,"Maury":232,"Dyer":134,"Fayette":188,"Tipton":172,"Sullivan":182,"Johnson":235,"Lincoln":180,"Bradley":204,"Sevier":358,"Knox":234,"Anderson":217,"Lawrence":192,"Williamson":361,"Bledsoe":227,"Weakley":138,"Morgan":185,"Bedford":217,"Cocke":233,"Monroe":236,"Henry":169},"North Carolina":{"Moore":220,"Pasquotank":190,"Madison":269,"Onslow":196,"Montgomery":263,"Mcdowell":249,"Mecklenburg":252,"Alleghany":240,"Johnston":192,"Rockingham":164,"Macon":288,"Nash":161,"Pamlico":265,"Camden":228,"Cherokee":248,"Henderson":266,"Hoke":158,"Dare":396,"Surry":193,"Washington":123,"Bertie":97,"Davidson":178,"Yadkin":194,"Martin":110,"Cabarrus":207,"Burke":205,"Davie":191,"Edgecombe":131,"Beaufort":211,"Ashe":284,"Buncombe":308,"Gates":217,"Randolph":185,"Lenoir":136,"Gaston":199,"Bladen":190,"Mitchell":228,"Caldwell":197,"Alexander":220,"Caswell":176,"Rowan":190,"Chatham":285,"Durham":235,"Catawba":202,"Wayne":165,"Perquimans":198,"Transylvania":322,"Anson":144,"Chowan":210,"Jackson":289,"Avery":340,"Swain":310,"Wake":231,"Polk":281,"Stanly":188,"Union":226,"Vance":158,"Greene":159,"Northampton":155,"Watauga":355,"Orange":280,"Scotland":135,"Granville":216,"Clay":237,"Person":216,"Harnett":171,"Franklin":207,"Carteret":371,"Pender":255,"Iredell":209,"Columbus":161,"Pitt":160,"Halifax":123,"Duplin":173,"Haywood":280,"Currituck":291,"Sampson":162,"Yancey":279,"Jones":136,"Craven":187,"Warren":245,"Guilford":184,"Cleveland":177,"New Hanover":308,"Rutherford":223,"Alamance":190,"Lincoln":231,"Hyde":389,"Forsyth":181,"Brunswick":237,"Cumberland":157,"Richmond":140,"Robeson":136,"Wilson":159,"Hertford":107,"Tyrrell":102,"Stokes":202,"Lee":175,"Wilkes":220,"Graham":281},"West Virginia":{"Harrison":128,"Webster":75,"Morgan":243,"Ohio":129,"Gilmer":121,"Tyler":128,"Mineral":168,"Wirt":134,"Berkeley":187,"Jackson":127,"Hancock":102,"Lincoln":87,"Logan":93,"Grant":165,"Hampshire":200,"Wetzel":127,"Monroe":126,"Barbour":117,"Jefferson":190,"Marion":129,"Doddridge":120,"Fayette":134,"Wyoming":59,"Pendleton":231,"Calhoun":110,"Mercer":117,"Randolph":133,"Kanawha":106,"Brooke":101,"Upshur":135,"Tucker":228,"Hardy":219,"Mason":117,"Braxton":103,"Taylor":147,"Preston":174,"Boone":97,"Cabell":107,"Clay":149,"Raleigh":117,"Monongalia":175,"Mcdowell":42,"Pocahontas":270,"Greenbrier":175,"Mingo":76,"Lewis":114,"Pleasants":163,"Roane":143,"Nicholas":114,"Ritchie":70,"Wood":108,"Marshall":104,"Wayne":107,"Putnam":150,"Summers":140},"Illinois":{"Henderson":95,"Knox":102,"Hamilton":89,"Tazewell":121,"Jo Daviess":180,"Williamson":123,"Pike":90,"Dekalb":198,"Montgomery":96,"Pulaski":83,"Calhoun":97,"Franklin":88,"Adams":121,"Stephenson":104,"Hardin":71,"De Witt":107,"Logan":89,"Crawford":126,"Grundy":185,"Hancock":86,"Mchenry":210,"Vermilion":71,"Mcdonough":71,"Lee":130,"White":91,"Washington":98,"Alexander":56,"Mason":65,"Iroquois":103,"Douglas":108,"Mercer":88,"Gallatin":78,"Wabash":77,"Lasalle":142,"Clinton":130,"Perry":78,"Bureau":117,"Macoupin":106,"Macon":86,"Champaign":180,"Sangamon":117,"Scott":56,"Coles":93,"Peoria":98,"Woodford":125,"Randolph":104,"Morgan":92,"Livingston":111,"St. Clair":128,"Ford":104,"Pope":109,"Richland":90,"Fayette":96,"Clark":118,"Jersey":152,"Piatt":138,"Winnebago":138,"Carroll":140,"Marion":90,"Brown":134,"Clay":92,"Putnam":156,"Jackson":95,"Greene":91,"Edgar":79,"Fulton":66,"Lawrence":100,"Lake":237,"Ogle":158,"Menard":141,"Jasper":104,"Shelby":105,"Christian":101,"Cumberland":150,"Mclean":132,"Massac":104,"Madison":135,"Effingham":136,"Schuyler":113,"Cook":229,"Saline":77,"Dupage":262,"Stark":84,"Moultrie":118,"Boone":180,"Henry":113,"Edwards":103,"Jefferson":114,"Union":124,"Warren":86,"Johnson":159,"Kane":221,"Kendall":200,"Wayne":81,"Will":206,"Rock Island":122,"Marshall":115,"Monroe":179,"Cass":100,"Bond":124,"Whiteside":109,"Kankakee":153},"North Dakota":{"Cavalier":70,"Cass":196,"Mchenry":75,"Eddy":73,"Traill":118,"Stutsman":122,"Golden Valley":103,"Mercer":128,"Kidder":234,"Morton":190,"Bowman":82,"Burke":62,"Nelson":91,"Sheridan":178,"Burleigh":223,"Bottineau":146,"Pierce":105,"Williams":215,"Mountrail":130,"Walsh":88,"Stark":160,"Barnes":137,"Billings":328,"Steele":82,"Sargent":131,"Wells":69,"Griggs":79,"Renville":95,"Sioux":339,"Grand Forks":179,"Ramsey":146,"Richland":213,"Adams":60,"Mckenzie":244,"Oliver":1574,"Rolette":110,"Lamoure":155,"Mclean":132,"Benson":95,"Hettinger":96,"Towner":72,"Logan":71,"Foster":87,"Ransom":86,"Pembina":71,"Grant":60,"Emmons":124,"Divide":116,"Mcintosh":77,"Dickey":113,"Ward":160,"Dunn":130},"Kansas":{"Bourbon":100,"Cherokee":106,"Morton":59,"Stanton":55,"Stevens":105,"Franklin":185,"Graham":80,"Hamilton":125,"Kingman":117,"Pratt":87,"Logan":67,"Crawford":112,"Saline":129,"Barton":107,"Seward":96,"Wilson":86,"Lincoln":125,"Leavenworth":197,"Ottawa":104,"Clay":105,"Jackson":166,"Riley":149,"Comanche":203,"Clark":70,"Neosho":100,"Pawnee":80,"Douglas":210,"Ellis":122,"Haskell":124,"Doniphan":135,"Anderson":153,"Osborne":98,"Scott":124,"Wallace":83,"Greeley":95,"Greenwood":79,"Sumner":115,"Phillips":81,"Stafford":81,"Russell":92,"Chase":159,"Harper":83,"Jewell":134,"Sherman":101,"Johnson":238,"Meade":82,"Elk":93,"Lane":127,"Linn":208,"Wyandotte":166,"Allen":93,"Ness":87,"Sheridan":185,"Montgomery":102,"Decatur":75,"Morris":109,"Mcpherson":121,"Rice":80,"Miami":192,"Rush":98,"Republic":84,"Smith":82,"Hodgeman":115,"Cheyenne":94,"Rooks":69,"Nemaha":105,"Finney":216,"Kiowa":108,"Mitchell":111,"Chautauqua":153,"Woodson":78,"Osage":144,"Wabaunsee":166,"Ford":178,"Coffey":134,"Kearny":180,"Reno":108,"Gray":152,"Brown":104,"Cowley":100,"Butler":151,"Harvey":125,"Rawlins":90,"Cloud":76,"Sedgwick":149,"Thomas":132,"Marshall":127,"Trego":92,"Ellsworth":139,"Grant":97,"Lyon":124,"Jefferson":178,"Edwards":75,"Shawnee":133,"Atchison":121,"Wichita":133,"Dickinson":96,"Geary":122,"Norton":108,"Labette":85,"Barber":68,"Gove":64,"Pottawatomie":172,"Washington":168,"Marion":100},"Virginia":{"Fairfax":370,"Lancaster":245,"Waynesboro":194,"Greensville":168,"Bath":188,"Nelson":276,"Galax":140,"King And Queen":256,"Culpeper":268,"James":231,"Hampton":196,"Gloucester":235,"Winchester":234,"Amelia":220,"Albemarle":277,"Fluvanna":219,"Louisa":252,"Westmoreland":243,"Rockingham":208,"Mecklenburg":220,"Bland":160,"King William":204,"Lee":124,"Spotsylvania":226,"Franklin":247,"Caroline":230,"Hanover":258,"Alexandria":442,"Warren":274,"Patrick":188,"Roanoke":170,"Charlottesville":351,"Portsmouth":187,"Norton":95,"Colonial Heights":204,"Newport News":190,"Tazewell":113,"Salem":204,"Smyth":147,"Richmond":218,"Augusta":221,"Brunswick":187,"Bedford":217,"York":224,"Carroll":177,"Russell":127,"Henrico":241,"Greene":239,"Floyd":240,"Loudoun":305,"Botetourt":199,"Chesterfield":221,"New Kent":233,"Giles":163,"Isle Of Wight":208,"Prince Edward":197,"Shenandoah":226,"Surry":219,"Buchanan":105,"Middlesex":275,"Northampton":298,"Buena Vista":157,"Powhatan":255,"Page":224,"Rappahannock":370,"Cumberland":238,"Hopewell":193,"Charles":210,"Virginia Beach":262,"Southampton":185,"Halifax":150,"Radford":170,"Lynchburg":169,"Manassas":256,"Goochland":265,"Arlington":474,"Sussex":212,"Henry":124,"Lexington":223,"Prince William":259,"Bristol":152,"Appomattox":222,"Wise":107,"Campbell":196,"Scott":141,"Grayson":178,"Fredericksburg":258,"Suffolk":208,"Alleghany":108,"Buckingham":218,"Charlotte":154,"Staunton":210,"Clarke":289,"Craig":230,"Danville":128,"Nottoway":162,"Rockbridge":232,"Falls Church":642,"Prince George":213,"Highland":221,"Petersburg":172,"King George":242,"Montgomery":223,"Madison":252,"Washington":182,"Fauquier":267,"Amherst":197,"Pittsylvania":147,"Chesapeake":227,"Poquoson":231,"Frederick":225,"Wythe":165,"Essex":230,"Stafford":222,"Orange":227,"Norfolk":218,"Pulaski":155,"Lunenburg":158,"Accomack":210,"Mathews":228,"Northumberland":264,"Harrisonburg":205,"Emporia":143,"Dickenson":98,"Dinwiddie":225},"Arizona":{"La Paz":285,"Mohave":253,"Apache":285,"Yavapai":327,"Maricopa":283,"Yuma":227,"Pinal":211,"Greenlee":160,"Coconino":406,"Pima":228,"Cochise":187,"Gila":304,"Santa Cruz":198,"Graham":201,"Navajo":300},"Minnesota":{"Chippewa":124,"Lincoln":141,"Mahnomen":178,"Sherburne":208,"Kanabec":214,"Wright":202,"Beltrami":208,"Yellow Medicine":104,"Carlton":279,"Winona":156,"Renville":113,"Big Stone":133,"Sibley":144,"Wadena":153,"Stevens":137,"Meeker":189,"Brown":103,"Nobles":139,"Ramsey":206,"Le Sueur":204,"Olmsted":212,"Otter Tail":240,"Benton":185,"Goodhue":201,"Todd":211,"Cottonwood":117,"Stearns":176,"Pipestone":131,"Marshall":88,"Steele":164,"Kittson":100,"Nicollet":157,"Rock":135,"Aitkin":278,"Redwood":116,"Wabasha":221,"Blue Earth":174,"Pope":194,"Cass":279,"Mower":137,"Traverse":123,"Jackson":114,"Swift":113,"Waseca":149,"Watonwan":91,"Scott":214,"Polk":119,"Fillmore":183,"Grant":138,"Hennepin":227,"Clay":165,"Chisago":236,"Faribault":92,"Martin":120,"Cook":382,"Mille Lacs":231,"Kandiyohi":173,"Freeborn":137,"Koochiching":199,"Red Lake":106,"Houston":157,"Lake Of The Woods":185,"Douglas":230,"Isanti":226,"Lyon":113,"Pennington":127,"Dakota":202,"Morrison":181,"St. Louis":210,"Itasca":228,"Becker":249,"Hubbard":219,"Wilkin":133,"Lac Qui Parle":100,"Carver":224,"Lake":202,"Murray":137,"Dodge":206,"Crow Wing":247,"Clearwater":190,"Roseau":135,"Pine":229,"Norman":91,"Washington":218,"Anoka":203,"Rice":203,"Mcleod":174},"Indiana":{"Crawford":192,"Jefferson":173,"Jackson":157,"Scott":161,"Adams":142,"Gibson":138,"Whitley":155,"Decatur":161,"Switzerland":169,"Wells":158,"Jay":91,"Lagrange":201,"Johnson":171,"Putnam":175,"Jasper":167,"Boone":185,"Montgomery":144,"Pike":137,"Porter":187,"Noble":162,"Union":164,"Greene":151,"Hendricks":165,"Huntington":127,"Howard":129,"Vermillion":100,"Delaware":115,"Benton":125,"Clark":185,"Lawrence":159,"Pulaski":112,"Martin":146,"Randolph":115,"Rush":138,"Wabash":135,"Monroe":202,"Kosciusko":216,"Steuben":233,"Fountain":117,"Franklin":150,"Dubois":139,"Owen":179,"Sullivan":133,"Ohio":143,"Orange":143,"Marion":160,"Perry":145,"Starke":153,"Carroll":201,"Brown":237,"Bartholomew":165,"Tippecanoe":189,"Daviess":144,"Hamilton":200,"Floyd":172,"Grant":106,"Knox":100,"Cass":120,"Warren":166,"Laporte":167,"Morgan":178,"White":199,"Harrison":170,"Miami":107,"Wayne":113,"Ripley":171,"Parke":128,"Blackford":109,"Clay":148,"Shelby":157,"Vanderburgh":129,"Posey":122,"Newton":130,"Dekalb":172,"Elkhart":161,"Fayette":117,"Clinton":148,"Dearborn":168,"Vigo":120,"Spencer":150,"Hancock":166,"Fulton":165,"Allen":171,"Marshall":165,"Madison":129,"Lake":171,"Warrick":162,"Henry":128,"St. Joseph":163,"Washington":157,"Jennings":145,"Tipton":140},"Oklahoma":{"Greer":90,"Cleveland":174,"Mcclain":181,"Okmulgee":109,"Kay":101,"Texas":123,"Pottawatomie":145,"Cimarron":47,"Delaware":207,"Adair":147,"Payne":163,"Tillman":64,"Osage":135,"Woodward":104,"Oklahoma":168,"Johnston":220,"Garvin":127,"Le Flore":150,"Bryan":161,"Comanche":122,"Canadian":175,"Mccurtain":347,"Ottawa":111,"Rogers":175,"Alfalfa":73,"Coal":119,"Major":96,"Grady":173,"Mcintosh":193,"Blaine":87,"Stephens":118,"Beaver":75,"Lincoln":150,"Harmon":56,"Creek":165,"Choctaw":137,"Okfuskee":127,"Cotton":81,"Jefferson":94,"Cherokee":169,"Harper":95,"Caddo":116,"Seminole":131,"Nowata":121,"Haskell":130,"Wagoner":171,"Pittsburg":138,"Garfield":121,"Pontotoc":136,"Jackson":120,"Pawnee":115,"Custer":121,"Grant":75,"Muskogee":118,"Washita":83,"Love":152,"Kingfisher":146,"Ellis":69,"Hughes":106,"Tulsa":169,"Craig":137,"Washington":115,"Mayes":168,"Atoka":153,"Noble":107,"Logan":183,"Latimer":148,"Woods":80,"Murray":159,"Dewey":74,"Beckham":106,"Roger Mills":55,"Carter":137,"Sequoyah":143,"Pushmataha":195,"Marshall":225,"Kiowa":92},"Georgia":{"Greene":282,"Lincoln":238,"Columbia":166,"Glynn":298,"Crawford":160,"Wilkes":153,"Walker":175,"Butts":192,"Effingham":183,"Laurens":132,"Fannin":325,"Candler":152,"Floyd":171,"Washington":136,"Wayne":153,"Fulton":250,"Long":156,"Hancock":258,"Liberty":162,"Mcduffie":160,"Worth":134,"Brooks":147,"Clinch":114,"Polk":170,"Dade":211,"Houston":152,"Wheeler":118,"Emanuel":122,"Wilkinson":113,"Fayette":218,"Monroe":176,"Crisp":131,"Wilcox":127,"Rockdale":158,"Tift":152,"Grady":165,"Chatham":227,"Jones":156,"Coweta":193,"Lee":171,"Murray":187,"Jefferson":143,"Meriwether":164,"Schley":115,"Pulaski":149,"Macon":85,"Lowndes":163,"Colquitt":155,"Jeff Davis":140,"Banks":196,"Whitfield":177,"Spalding":162,"Screven":145,"Pickens":226,"Warren":137,"Twiggs":113,"Telfair":112,"Taylor":107,"Quitman":179,"Pierce":165,"Bacon":131,"Mitchell":101,"Miller":93,"Ware":129,"Bulloch":185,"Glascock":118,"Turner":98,"Franklin":189,"Johnson":88,"Stewart":76,"Evans":141,"Gordon":176,"Pike":195,"Taliaferro":93,"Hart":206,"Walton":200,"Mcintosh":220,"Treutlen":114,"Dooly":129,"Catoosa":195,"Gilmer":274,"Seminole":145,"Bleckley":132,"Gwinnett":187,"Montgomery":147,"Clayton":147,"Dekalb":190,"Early":110,"Burke":162,"Muscogee":132,"Decatur":153,"Forsyth":229,"Bartow":191,"Union":253,"Dodge":110,"Camden":197,"Elbert":158,"Baldwin":157,"Randolph":98,"Cobb":207,"Tattnall":146,"Talbot":147,"Chattahoochee":144,"Morgan":240,"Lumpkin":236,"Brantley":160,"Carroll":176,"Barrow":191,"Jenkins":133,"Rabun":285,"Oglethorpe":179,"Jasper":198,"Lanier":169,"Bibb":118,"Putnam":296,"Jackson":195,"Irwin":131,"Terrell":102,"Coffee":148,"Cook":156,"Habersham":204,"Hall":210,"Toombs":129,"Echols":239,"Appling":136,"Heard":206,"Ben Hill":104,"Richmond":146,"Clarke":214,"Berrien":145,"Bryan":202,"Marion":142,"Sumter":121,"Lamar":185,"Chattooga":146,"Charlton":189,"Clay":217,"Webster":73,"Upson":163,"Dawson":221,"White":242,"Henry":157,"Oconee":242,"Harris":185,"Atkinson":78,"Troup":162,"Madison":199,"Douglas":166,"Peach":144,"Stephens":177,"Towns":260,"Newton":165,"Paulding":181,"Cherokee":223,"Thomas":196,"Calhoun":112,"Dougherty":105,"Haralson":180},"Colorado":{"El Paso":236,"Boulder":420,"Pitkin":2325,"San Miguel":1712,"Chaffee":444,"Phillips":136,"Crowley":134,"Washington":151,"Adams":245,"Mineral":424,"Yuma":202,"Jefferson":313,"Teller":283,"Morgan":183,"Kiowa":101,"Moffat":201,"San Juan":417,"Archuleta":357,"Park":337,"Huerfano":224,"Summit":838,"Elbert":251,"Prowers":141,"Pueblo":189,"Las Animas":158,"Rio Blanco":200,"Costilla":214,"Lake":418,"Mesa":294,"Baca":107,"Douglas":250,"Broomfield":276,"Arapahoe":259,"Custer":280,"Grand":527,"Gilpin":303,"Cheyenne":135,"Dolores":305,"Saguache":253,"Weld":225,"Routt":840,"Garfield":429,"La Plata":461,"Lincoln":166,"Delta":271,"Ouray":524,"Sedgwick":109,"Eagle":684,"Fremont":244,"Denver":387,"Bent":133,"Rio Grande":258,"Otero":136,"Clear Creek":373,"Gunnison":744,"Kit Carson":138,"Hinsdale":392,"Montrose":311,"Jackson":169,"Larimer":273,"Alamosa":194,"Montezuma":278,"Conejos":232,"Logan":165},"Missouri":{"Howell":144,"Cooper":143,"Dekalb":157,"Jackson":174,"Monroe":174,"Carroll":125,"Lafayette":144,"Iron":135,"Ray":174,"Oregon":144,"Laclede":163,"Worth":63,"Shannon":165,"Macon":122,"Bollinger":122,"Clinton":185,"Miller":228,"Barry":174,"Cape Girardeau":145,"Harrison":91,"Texas":137,"Crawford":159,"Jefferson":188,"Ozark":203,"Perry":156,"New Madrid":87,"Cole":155,"Platte":210,"Buchanan":130,"Camden":263,"Jasper":143,"St. Clair":149,"Boone":203,"Livingston":111,"Webster":164,"Andrew":134,"Dunklin":69,"Putnam":170,"Audrain":142,"Wright":146,"Howard":119,"Dade":115,"Sullivan":125,"Dent":147,"Nodaway":122,"Christian":181,"Bates":168,"Cass":202,"Mercer":93,"Chariton":135,"Clark":130,"Knox":95,"Lewis":133,"Gentry":120,"Scott":104,"Taney":199,"St. Louis":159,"Atchison":93,"Maries":162,"Hickory":167,"Vernon":124,"Grundy":104,"Ralls":196,"Douglas":158,"Daviess":186,"Pulaski":138,"Callaway":178,"Mississippi":97,"Shelby":100,"St. Charles":204,"Newton":139,"Madison":136,"Moniteau":141,"Warren":219,"Pike":119,"Morgan":243,"Lawrence":157,"Washington":142,"Polk":169,"Holt":165,"Greene":173,"Adair":106,"Barton":135,"Dallas":173,"Ripley":141,"Schuyler":147,"Caldwell":144,"Randolph":154,"Scotland":102,"Pettis":142,"Saline":131,"Johnson":175,"Mcdonald":172,"Carter":197,"Phelps":153,"Lincoln":205,"Montgomery":185,"Gasconade":180,"Cedar":149,"Osage":161,"St. Francois":151,"Pemiscot":62,"Stoddard":113,"Wayne":109,"Ste. Genevieve":140,"Marion":116,"Reynolds":232,"Henry":129,"Stone":240,"Butler":114,"Franklin":183,"Clay":201,"Linn":103,"Benton":180},"Arkansas":{"Franklin":137,"Benton":224,"Van Buren":131,"Hot Spring":140,"Logan":125,"Jackson":91,"Hempstead":84,"Grant":151,"Conway":140,"Pike":191,"Polk":158,"Cross":117,"Garland":189,"Nevada":60,"Montgomery":227,"Ouachita":94,"Sebastian":144,"Bradley":70,"Calhoun":96,"Sharp":129,"Saline":169,"St. Francis":83,"Little River":95,"Howard":102,"Arkansas":84,"Pulaski":146,"Yell":145,"Perry":144,"Madison":205,"Chicot":89,"Poinsett":113,"Lawrence":117,"Washington":218,"Newton":247,"Clark":118,"Cleveland":93,"Marion":179,"Lafayette":196,"Randolph":110,"Dallas":72,"Pope":142,"Crawford":153,"Miller":134,"Jefferson":77,"Stone":161,"Mississippi":109,"Boone":154,"White":147,"Lonoke":152,"Sevier":179,"Cleburne":200,"Craighead":148,"Greene":134,"Monroe":67,"Johnson":146,"Crittenden":135,"Prairie":104,"Desha":75,"Scott":104,"Phillips":62,"Columbia":106,"Fulton":152,"Faulkner":167,"Drew":114,"Lincoln":90,"Baxter":176,"Ashley":87,"Woodruff":117,"Carroll":199,"Union":105,"Clay":96,"Lee":61,"Searcy":172,"Izard":134,"Independence":133},"South Carolina":{"Lexington":164,"Darlington":147,"Hampton":133,"Georgetown":264,"Fairfield":219,"Laurens":163,"Chester":163,"Abbeville":160,"Florence":151,"Orangeburg":149,"Kershaw":168,"Clarendon":168,"Newberry":214,"Dillon":114,"Pickens":200,"Charleston":387,"Chesterfield":163,"Allendale":96,"Berkeley":214,"Calhoun":158,"Spartanburg":167,"Dorchester":198,"Greenwood":175,"Cherokee":165,"Colleton":215,"Aiken":172,"Marion":130,"Oconee":218,"Bamberg":115,"Anderson":177,"Lancaster":206,"Sumter":137,"Marlboro":111,"Beaufort":339,"Union":133,"Mccormick":215,"Richland":154,"Williamsburg":114,"Jasper":266,"Edgefield":165,"Saluda":262,"Lee":98,"Barnwell":149,"Greenville":205,"Horry":229,"York":211},"Pennsylvania":{"Schuylkill":110,"Chester":269,"Somerset":124,"Cumberland":195,"Cambria":74,"Centre":226,"Bucks":291,"Elk":107,"Washington":160,"Susquehanna":200,"Mercer":140,"Clinton":133,"Tioga":110,"Pike":195,"Westmoreland":177,"Forest":125,"Montour":192,"Greene":119,"Armstrong":88,"Clarion":138,"Lawrence":112,"Potter":165,"Northumberland":89,"Lackawanna":154,"Luzerne":145,"Allegheny":181,"Philadelphia":212,"Montgomery":259,"Cameron":85,"Adams":207,"Lehigh":206,"Dauphin":162,"Indiana":109,"Bedford":148,"Lebanon":212,"Beaver":159,"Carbon":225,"Juniata":150,"Snyder":178,"Fulton":196,"Fayette":98,"Perry":177,"Northampton":214,"Delaware":218,"Venango":117,"Mckean":92,"Wayne":214,"Lancaster":207,"Franklin":173,"Bradford":108,"York":179,"Jefferson":130,"Blair":102,"Butler":214,"Union":189,"Columbia":170,"Sullivan":202,"Monroe":202,"Lycoming":139,"Huntingdon":148,"Berks":185,"Mifflin":123,"Erie":157,"Crawford":138,"Clearfield":121,"Warren":98,"Wyoming":183},"Florida":{"Franklin":386,"Gilchrist":199,"Sumter":246,"Miami-Dade":467,"Bradford":193,"Jefferson":197,"Monroe":853,"Highlands":155,"Citrus":182,"Pasco":204,"Gadsden":158,"Hendry":220,"Collier":408,"Lake":211,"Broward":302,"Baker":208,"Hernando":197,"Glades":211,"Gulf":368,"St. Lucie":233,"Duval":190,"Liberty":152,"Lee":241,"Putnam":211,"Hillsborough":234,"Suwannee":205,"Palm Beach":309,"Hamilton":191,"Clay":192,"Indian River":252,"Walton":515,"Osceola":212,"Nassau":282,"Marion":180,"Okaloosa":265,"Madison":166,"Orange":243,"Okeechobee":229,"Lafayette":220,"Desoto":235,"Pinellas":312,"Santa Rosa":213,"Taylor":204,"Martin":299,"Washington":175,"Volusia":235,"Alachua":203,"Sarasota":285,"Polk":188,"Charlotte":223,"Calhoun":158,"Holmes":155,"Leon":203,"Escambia":198,"Levy":208,"Hardee":159,"Seminole":230,"Dixie":214,"Flagler":225,"St. Johns":270,"Columbia":194,"Bay":308,"Brevard":225,"Jackson":136,"Wakulla":206,"Manatee":260,"Union":219},"Kentucky":{"Lee":224,"Allen":174,"Lawrence":138,"Jackson":141,"Simpson":184,"Lincoln":157,"Robertson":174,"Whitley":136,"Laurel":170,"Clark":172,"Bourbon":177,"Marion":160,"Christian":169,"Grant":194,"Monroe":136,"Oldham":217,"Webster":121,"Powell":209,"Johnson":117,"Menifee":193,"Clay":104,"Anderson":186,"Todd":186,"Leslie":127,"Nicholas":129,"Boyle":172,"Scott":207,"Carroll":154,"Butler":150,"Gallatin":146,"Hickman":116,"Perry":124,"Fayette":205,"Jefferson":171,"Bracken":123,"Campbell":207,"Pulaski":162,"Barren":153,"Russell":180,"Mercer":181,"Henderson":143,"Hopkins":133,"Hancock":142,"Kenton":205,"Carlisle":95,"Ballard":110,"Mccreary":142,"Graves":133,"Calloway":169,"Logan":168,"Bath":165,"Ohio":159,"Madison":189,"Owsley":159,"Henry":191,"Elliott":170,"Bell":125,"Carter":119,"Fleming":145,"Casey":149,"Owen":183,"Grayson":192,"Washington":178,"Knott":113,"Pendleton":195,"Meade":177,"Shelby":186,"Hart":164,"Estill":159,"Nelson":197,"Mccracken":134,"Crittenden":131,"Letcher":123,"Spencer":220,"Trigg":175,"Metcalfe":141,"Magoffin":135,"Hardin":167,"Floyd":108,"Muhlenberg":123,"Larue":171,"Daviess":163,"Trimble":166,"Boone":199,"Wayne":171,"Rowan":147,"Lewis":149,"Breckinridge":190,"Pike":126,"Montgomery":169,"Green":155,"Livingston":195,"Franklin":180,"Warren":184,"Wolfe":373,"Fulton":95,"Knox":125,"Marshall":186,"Bullitt":190,"Cumberland":160,"Mason":98,"Martin":91,"Mclean":135,"Caldwell":122,"Adair":157,"Harrison":185,"Harlan":103,"Lyon":213,"Jessamine":209,"Boyd":109,"Morgan":137,"Breathitt":164,"Woodford":196,"Edmonson":184,"Greenup":133,"Garrard":188,"Taylor":155,"Clinton":177,"Union":62,"Rockcastle":132},"Alaska":{"Southeast Fairbanks Census Area":193,"Sitka And Borough":328,"Kodiak Island Borough":302,"Nome Census Area":324,"Bristol Bay Borough":312,"Matanuska-Susitna Borough":276,"North Slope Borough":184,"Chugach Census Area":214,"Prince Of Wales-Hyder Census Area":277,"Dillingham Census Area":257,"Kenai Peninsula Borough":284,"Petersburg Borough":275,"Juneau And Borough":354,"Wrangell And Borough":303,"Hoonah-Angoon Census Area":206,"Denali Borough":307,"Bethel Census Area":334,"Yukon-Koyukuk Census Area":121,"Kusilvak Census Area":108,"Fairbanks North Star Borough":196,"Copper River Census Area":204,"Anchorage Municipality":262,"Northwest Arctic Borough":313,"Haines Borough":186,"Lake And Peninsula Borough":247,"Skagway Municipality":330,"Ketchikan Gateway Borough":291},"Alabama":{"Coosa":183,"Escambia":109,"Covington":128,"Clarke":110,"Dallas":67,"Choctaw":94,"Marengo":79,"Pike":141,"Marion":112,"Cherokee":236,"Crenshaw":107,"Geneva":153,"Lamar":76,"Autauga":151,"Henry":152,"Montgomery":117,"St. Clair":172,"Limestone":175,"Fayette":115,"Walker":141,"Monroe":108,"Lauderdale":163,"Lowndes":100,"Bullock":144,"Greene":102,"Calhoun":121,"Madison":169,"Baldwin":332,"Mobile":151,"Dekalb":166,"Chambers":146,"Perry":72,"Hale":135,"Lawrence":149,"Butler":109,"Morgan":152,"Marshall":188,"Lee":202,"Bibb":143,"Randolph":204,"Russell":139,"Macon":103,"Jefferson":146,"Winston":310,"Shelby":186,"Sumter":71,"Barbour":138,"Washington":136,"Dale":134,"Elmore":165,"Wilcox":145,"Cleburne":168,"Coffee":154,"Houston":137,"Colbert":145,"Tallapoosa":286,"Franklin":129,"Conecuh":112,"Chilton":158,"Etowah":137,"Cullman":179,"Pickens":103,"Tuscaloosa":179,"Blount":149,"Jackson":164,"Talladega":139,"Clay":121},"Maryland":{"Worcester":404,"Baltimore":151,"Queen Anne'S":291,"Kent":263,"Cecil":218,"Allegany":113,"Carroll":237,"Washington":187,"Somerset":172,"St. Mary'S":229,"Frederick":231,"Calvert":238,"Harford":210,"Charles":209,"Dorchester":199,"Anne Arundel":274,"Garrett":275,"Wicomico":181,"Howard":261,"Talbot":290,"Prince George'S":242,"Montgomery":313,"Caroline":209},"Washington":{"Clark":312,"Wahkiakum":326,"Kittitas":424,"Ferry":251,"Adams":205,"Stevens":256,"King":541,"Island":401,"Douglas":319,"Whatcom":386,"Klickitat":352,"Garfield":155,"Snohomish":409,"Benton":270,"Cowlitz":274,"Mason":311,"Grays Harbor":286,"Skagit":377,"Okanogan":261,"Skamania":327,"Yakima":241,"Asotin":222,"Walla Walla":260,"Chelan":349,"Lincoln":198,"Pierce":317,"Whitman":193,"Spokane":235,"Kitsap":323,"Jefferson":373,"Lewis":296,"San Juan":645,"Franklin":265,"Pacific":307,"Columbia":162,"Grant":255,"Thurston":299,"Clallam":321,"Pend Oreille":267},"Idaho":{"Clearwater":219,"Adams":386,"Benewah":231,"Camas":313,"Kootenai":367,"Idaho":288,"Jefferson":193,"Blaine":910,"Valley":566,"Minidoka":232,"Shoshone":263,"Oneida":211,"Lincoln":206,"Madison":199,"Power":196,"Nez Perce":255,"Teton":516,"Lemhi":288,"Franklin":217,"Boundary":322,"Twin Falls":259,"Bannock":188,"Bingham":183,"Butte":149,"Gooding":253,"Lewis":168,"Bonner":427,"Owyhee":304,"Ada":308,"Jerome":238,"Bear Lake":226,"Gem":347,"Elmore":240,"Canyon":269,"Bonneville":183,"Boise":341,"Cassia":219,"Latah":291,"Custer":262,"Washington":273,"Fremont":358,"Payette":262,"Caribou":190},"Vermont":{"Chittenden":321,"Lamoille":400,"Orleans":216,"Franklin":234,"Windham":249,"Bennington":276,"Essex":201,"Washington":279,"Caledonia":199,"Addison":265,"Rutland":227,"Orange":203,"Grand Isle":272,"Windsor":303},"Montana":{"Gallatin":432,"Chouteau":170,"Blaine":66,"Ravalli":376,"Sweet Grass":270,"Lincoln":376,"Judith Basin":147,"Powder River":211,"Pondera":137,"Hill":123,"Deer Lodge":210,"Wheatland":224,"Flathead":426,"Prairie":97,"Big Horn":139,"Teton":250,"Rosebud":150,"Lewis And Clark":286,"Golden Valley":146,"Dawson":116,"Mccone":69,"Granite":409,"Yellowstone":218,"Garfield":201,"Missoula":351,"Phillips":142,"Sheridan":109,"Madison":583,"Cascade":220,"Valley":149,"Toole":134,"Powell":288,"Wibaux":164,"Custer":140,"Liberty":94,"Park":386,"Fergus":200,"Carbon":360,"Meagher":374,"Lake":361,"Stillwater":282,"Broadwater":325,"Glacier":115,"Roosevelt":83,"Jefferson":317,"Beaverhead":213,"Sanders":355,"Musselshell":207,"Mineral":368,"Fallon":82,"Petroleum":247,"Daniels":145,"Richland":196,"Silver Bow":213},"Wisconsin":{"Shawano":172,"Trempealeau":143,"Sheboygan":208,"Fond Du Lac":192,"Oneida":325,"Winnebago":186,"Pepin":173,"Grant":141,"Waukesha":254,"Door":311,"Outagamie":192,"Rusk":157,"Polk":249,"Langlade":161,"Clark":132,"Dodge":214,"Green":189,"Lincoln":226,"Washburn":215,"Ozaukee":261,"Price":155,"Taylor":160,"Barron":193,"Rock":201,"Manitowoc":172,"Monroe":163,"Ashland":165,"La Crosse":199,"Walworth":272,"Oconto":211,"Sauk":236,"Chippewa":204,"Iron":125,"Calumet":224,"Kenosha":217,"Jefferson":224,"Marinette":165,"Buffalo":192,"Jackson":161,"Columbia":221,"St. Croix":242,"Bayfield":270,"Menominee":274,"Kewaunee":196,"Crawford":141,"Iowa":191,"Sawyer":264,"Florence":124,"Waupaca":196,"Waushara":199,"Marathon":171,"Adams":204,"Forest":234,"Portage":206,"Pierce":235,"Vilas":216,"Juneau":202,"Douglas":203,"Washington":231,"Brown":215,"Wood":147,"Vernon":194,"Racine":212,"Dunn":187,"Green Lake":205,"Milwaukee":197,"Lafayette":162,"Richland":218,"Marquette":183,"Burnett":235,"Eau Claire":189,"Dane":253},"Oregon":{"Jefferson":276,"Malheur":221,"Crook":328,"Coos":282,"Yamhill":304,"Union":254,"Hood River":431,"Clatsop":349,"Polk":286,"Douglas":263,"Lane":310,"Morrow":218,"Sherman":161,"Jackson":281,"Wheeler":274,"Washington":294,"Gilliam":206,"Lake":169,"Lincoln":356,"Wasco":270,"Linn":286,"Multnomah":325,"Grant":202,"Umatilla":230,"Columbia":280,"Curry":336,"Tillamook":386,"Clackamas":324,"Josephine":268,"Marion":292,"Benton":311,"Harney":185,"Klamath":228,"Wallowa":284,"Baker":195,"Deschutes":395},"Connecticut":{"Lower Connecticut River Valley Planning Region":317,"Northeastern Connecticut Planning Region":253,"Western Connecticut Planning Region":417,"Northwest Hills Planning Region":308,"South Central Connecticut Planning Region":278,"Naugatuck Valley Planning Region":248,"Greater Bridgeport Planning Region":308,"Capitol Planning Region":238,"Southeastern Connecticut Planning Region":278},"New Mexico":{"Mora":234,"Luna":123,"Taos":358,"Guadalupe":136,"Cibola":137,"Lea":153,"Chaves":139,"Socorro":174,"San Miguel":213,"Sierra":168,"Eddy":172,"Los Alamos":305,"Santa Fe":389,"Catron":216,"Bernalillo":225,"De Baca":199,"Rio Arriba":238,"Grant":173,"Lincoln":261,"Torrance":179,"Mckinley":145,"Colfax":281,"Otero":172,"Quay":139,"Valencia":204,"Hidalgo":139,"Curry":126,"Do\ufffdA Ana":186,"Roosevelt":112,"Union":116,"Sandoval":226,"San Juan":190},"Utah":{"Weber":236,"Utah":219,"Cache":215,"Uintah":192,"Grand":459,"Duchesne":210,"Iron":246,"Sevier":196,"Wayne":234,"Millard":178,"Sanpete":199,"Emery":167,"Kane":306,"Davis":248,"Washington":292,"Juab":169,"Daggett":328,"Summit":877,"Tooele":192,"Piute":219,"Morgan":290,"San Juan":240,"Garfield":283,"Salt Lake":271,"Rich":299,"Carbon":147,"Beaver":194,"Box Elder":212,"Wasatch":523},"New Jersey":{"Morris":341,"Gloucester":221,"Atlantic":245,"Hudson":556,"Monmouth":409,"Sussex":271,"Hunterdon":301,"Essex":356,"Union":353,"Cumberland":200,"Cape May":673,"Middlesex":352,"Bergen":427,"Mercer":291,"Ocean":313,"Passaic":324,"Warren":238,"Salem":189,"Burlington":241,"Somerset":341,"Camden":224},"New Hampshire":{"Grafton":293,"Rockingham":380,"Strafford":336,"Hillsborough":304,"Belknap":347,"Cheshire":275,"Carroll":354,"Sullivan":270,"Coos":175,"Merrimack":280},"Massachusetts":{"Plymouth":404,"Nantucket":1687,"Barnstable":578,"Suffolk":890,"Franklin":255,"Middlesex":493,"Essex":423,"Worcester":303,"Norfolk":486,"Hampshire":304,"Berkshire":276,"Hampden":241,"Bristol":330,"Dukes":1080},"Wyoming":{"Carbon":166,"Niobrara":115,"Crook":356,"Goshen":112,"Uinta":185,"Weston":156,"Albany":228,"Converse":180,"Sheridan":309,"Fremont":190,"Sweetwater":156,"Hot Springs":147,"Natrona":182,"Lincoln":349,"Campbell":175,"Sublette":264,"Washakie":140,"Teton":1353,"Park":251,"Johnson":235,"Big Horn":178,"Platte":174,"Laramie":203},"Nevada":{"Mineral":155,"Washoe":348,"Storey":304,"White Pine":158,"Elko":264,"Lincoln":170,"Clark":265,"Pershing":179,"Lyon":265,"Eureka":65,"Lander":217,"Nye":219,"Humboldt":250,"Carson":318,"Esmeralda":339,"Douglas":484,"Churchill":269},"Rhode Island":{"Kent":350,"Newport":605,"Washington":546,"Bristol":451,"Providence":335},"Delaware":{"Kent":203,"Sussex":262,"New Castle":213},"Maine":{"York":389,"Somerset":193,"Penobscot":195,"Waldo":257,"Knox":298,"Aroostook":133,"Cumberland":381,"Lincoln":355,"Androscoggin":228,"Oxford":254,"Hancock":339,"Franklin":283,"Kennebec":238,"Sagadahoc":323,"Piscataquis":212,"Washington":210},"Hawaii":{"Honolulu":700,"Hawaii":510,"Maui":937,"Kauai":961},"District of Columbia":{"District Of Columbia":506}};

function lookupPpsf(state, newHomeCounty) {
  if (!state || !newHomeCounty) return null;
  const counties = PPSF_DATA[state];
  if (!counties) return null;
  const input = newHomeCounty.trim().toLowerCase();
  // Try exact match, then strip county suffix
  for (const [name, price] of Object.entries(counties)) {
    const n = name.toLowerCase();
    if (n === input || n === input.replace(/\s*(county|parish|borough|municipality|census area|city|district)\s*$/i, '').trim()) {
      return { name, price };
    }
  }
  // Partial match
  const stripped = input.replace(/\s*(county|parish|borough|municipality|census area|city|district)\s*$/i, '').trim();
  for (const [name, price] of Object.entries(counties)) {
    if (name.toLowerCase().startsWith(stripped) || stripped.startsWith(name.toLowerCase())) {
      return { name, price };
    }
  }
  return null;
}


// Fuzzy county lookup — strips "County/Parish/Borough" suffix for matching
function lookupTaxRate(state, newHomeCounty) {
  if (!state || !newHomeCounty) return null;
  const counties = TAX_DATA[state];
  if (!counties) return null;
  const input = newHomeCounty.trim().toLowerCase();
  // Exact match first
  for (const [name, rate] of Object.entries(counties)) {
    if (name.toLowerCase() === input) return { name, rate };
  }
  // Try with "County" appended
  for (const [name, rate] of Object.entries(counties)) {
    if (name.toLowerCase() === input + " county") return { name, rate };
  }
  // Try stripping suffix from input
  const stripped = input.replace(/\s*(county|parish|borough|municipality|census area|city|district)\s*$/i, "").trim();
  for (const [name, rate] of Object.entries(counties)) {
    const nameLower = name.toLowerCase().replace(/\s*(county|parish|borough|municipality|census area|city|district)\s*$/i, "").trim();
    if (nameLower === stripped) return { name, rate };
  }
  // Partial match
  for (const [name, rate] of Object.entries(counties)) {
    if (name.toLowerCase().includes(stripped) || stripped.includes(name.toLowerCase().replace(/\s*(county|parish|borough)$/i,"").trim())) {
      return { name, rate };
    }
  }
  return null;
}

// Keep minimal COUNTIES for non-tax data (insurance, newHomePpsf, appreciation)



// ── Storage ───────────────────────────────────────────────────────────────────
const STORAGE_KEY   = "domavi-v2";
const PROFILE_KEY   = "domavi-profile-v2";
const SCENARIOS_KEY = "domavi-scenarios-v1";
const ONBOARD_KEY   = "domavi-onboarded-v1";

// In-memory storage (localStorage not available in this environment)
function ls(key)         { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : null; } catch { return null; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ── Helpers ───────────────────────────────────────────────────────────────────
function calcPI(principal, annualRate, termMonths) {
  const mr = annualRate / 100 / 12;
  if (mr === 0 || termMonths <= 0) return principal / Math.max(termMonths, 1);
  return (principal * mr * Math.pow(1 + mr, termMonths)) / (Math.pow(1 + mr, termMonths) - 1);
}
const fmt      = n => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtFull  = n => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const parseDollar = s => Number(String(s).replace(/[^0-9.]/g, "")) || 0;
const MONTHS_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif";
const SF_D = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";
const MONO = "'SF Mono', 'Fira Code', 'DM Mono', monospace";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#F2EEF7", card: "#FFFFFF", cardAlt: "#F9F5FC", border: "#E2D5EF", track: "#D8CCEA",
  blue: "#c0166a", blueL: "#e0398e", blueBg: "#FDF0F7",
  green: "#0b8f8f", greenBg: "#E8F8F8", greenBorder: "#7dd6d6",
  amber: "#c45e00", amberBg: "#FFF4E6", amberBorder: "#f5bc7a",
  red: "#b8084f", redBg: "#FDF0F5", redBorder: "#f0a0c0",
  text: "#1a0e2e", mid: "#5a3e72", dim: "#9e87b5",
  pill: "#F5EEFF", pillBorder: "#d4b8f0", pillText: "#6b21a8", pillAccent: "#c0166a",
  sep: "rgba(60,0,80,0.10)",
};

// ── Credit adjustments ────────────────────────────────────────────────────────
const CREDIT_ADJ = {
  "760+": 0, "740-759": 0.125, "720-739": 0.25, "700-719": 0.5,
  "680-699": 0.75, "660-679": 1.0, "640-659": 1.5, "620-639": 2.0,
};

// ── UI Primitives ─────────────────────────────────────────────────────────────
function Card({ children, style = {}, accent }) {
  return (
    <div style={{
      background: C.card,
      borderRadius: "12px",
      marginBottom: "12px",
      overflow: "hidden",
      boxShadow: accent
        ? `0 0 0 1px ${accent}30, 0 2px 8px rgba(26,14,46,0.08)`
        : "0 1px 0 rgba(60,0,80,0.08), 0 2px 8px rgba(26,14,46,0.06)",
      ...style
    }}>{children}</div>
  );
}

function SectionLabel({ children, color = C.blue }) {
  return (
    <div style={{
      fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em",
      textTransform: "uppercase", color, fontFamily: SF,
      padding: "20px 20px 10px",
    }}>{children}</div>
  );
}

function LineItem({ label, value, color, last }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 20px",
      borderBottom: last ? "none" : "0.5px solid rgba(60,0,80,0.10)",
    }}>
      <span style={{ fontSize: "15px", color: C.text, fontFamily: SF }}>{label}</span>
      <span style={{ fontSize: "15px", fontWeight: 600, color: color || C.blue, fontFamily: SF }}>{value}</span>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      {label && <span style={{ fontSize: "15px", color: C.mid, fontFamily: SF }}>{label}</span>}
      <div style={{ width: "51px", height: "31px", borderRadius: "15.5px", position: "relative", background: checked ? C.blue : "#E9E3F0", transition: "background 0.25s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: "2px", left: checked ? "22px" : "2px", width: "27px", height: "27px", borderRadius: "50%", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.20)", transition: "left 0.25s" }} />
      </div>
    </button>
  );
}

function Pill({ children, color = C.pillText, bg = C.pill, border = C.pillBorder }) {
  return (
    <div style={{ background: bg, borderRadius: "10px", padding: "12px 20px", fontSize: "13px", color, fontFamily: SF, marginBottom: "8px", lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  const scrollRef = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(false);
  const check = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };
  useEffect(() => {
    check();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", check, { passive: true });
    return () => el.removeEventListener("scroll", check);
  }, [tabs]);
  const nudge = d => scrollRef.current && scrollRef.current.scrollBy({ left: d * 80, behavior: "smooth" });
  return (
    <div style={{ position: "relative", marginBottom: "10px" }}>
      {canLeft && (
        <button onClick={() => nudge(-1)} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "28px", zIndex: 2, background: "linear-gradient(to right,rgba(242,238,247,1) 50%,transparent)", border: "none", cursor: "pointer", color: C.blue, fontSize: "18px", fontFamily: SF, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {"‹"}
        </button>
      )}
      <div ref={scrollRef} style={{ display: "flex", background: "rgba(120,80,160,0.10)", borderRadius: "9px", padding: "2px", overflowX: "auto", scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            flex: "0 0 auto", padding: "6px 13px", borderRadius: "7px", border: "none",
            cursor: "pointer", background: active === t.id ? "#fff" : "transparent",
            color: active === t.id ? C.blue : C.mid,
            fontSize: "13px", fontWeight: active === t.id ? 600 : 400,
            fontFamily: SF, boxShadow: active === t.id ? "0 1px 4px rgba(26,14,46,0.12)" : "none",
            whiteSpace: "nowrap", transition: "all 0.18s",
          }}>{t.label}</button>
        ))}
      </div>
      {canRight && (
        <button onClick={() => nudge(1)} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "28px", zIndex: 2, background: "linear-gradient(to left,rgba(242,238,247,1) 50%,transparent)", border: "none", cursor: "pointer", color: C.blue, fontSize: "18px", fontFamily: SF, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {"›"}
        </button>
      )}
    </div>
  );
}

function Field({ label, value, min, max, step, onChange, display, parse, prefix, suffix, inputMode = "decimal", note, badge }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState("");
  const ref = useRef(null);
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const startEdit = () => { setDraft(prefix === "$" ? String(Math.round(value)) : String(value)); setEditing(true); setTimeout(() => ref.current && ref.current.select(), 0); };
  const commit = () => { const n = parse ? parse(draft) : parseFloat(draft); if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n))); setEditing(false); };
  const onKey  = e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); };
  return (
    <div style={{ padding: "16px 20px 20px", borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {label && <span style={{ fontSize: "15px", color: C.text, fontFamily: SF }}>{label}</span>}
          {note  && <span style={{ fontSize: "12px", color: C.blueL, fontFamily: SF }}>{note}</span>}
          {badge && <span style={{ fontSize: "11px", background: C.blueBg, color: C.blue, borderRadius: "5px", padding: "1px 6px", fontFamily: SF }}>{badge}</span>}
        </div>
        {editing ? (
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {prefix && <span style={{ fontSize: "17px", color: C.blue, fontFamily: SF, fontWeight: 600 }}>{prefix}</span>}
            <input ref={ref} inputMode={inputMode} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={onKey}
              style={{ width: "96px", fontSize: "17px", fontWeight: 600, fontFamily: SF, color: C.blue, background: C.blueBg, border: "1.5px solid " + C.blue, borderRadius: "8px", padding: "3px 8px", outline: "none", textAlign: "right" }} />
            {suffix && <span style={{ fontSize: "17px", color: C.blue, fontFamily: SF, fontWeight: 600 }}>{suffix}</span>}
          </div>
        ) : (
          <button onClick={startEdit} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "17px", fontWeight: 600, color: C.blue, fontFamily: SF }}>{display(value)}</span>
          </button>
        )}
      </div>
      <div style={{ position: "relative", height: "4px", borderRadius: "2px", background: "rgba(120,80,160,0.15)", marginLeft: "2px", marginRight: "2px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: pct + "%", borderRadius: "2px", background: "linear-gradient(90deg," + C.blue + "," + C.blueL + ")" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", width: "100%", opacity: 0, cursor: "pointer", height: "32px", margin: 0 }} />
        <div style={{ position: "absolute", top: "50%", left: pct + "%", transform: "translate(-50%,-50%)", width: "24px", height: "24px", borderRadius: "50%", background: "#fff", border: "2px solid " + C.blue, boxShadow: "0 2px 8px rgba(192,22,106,0.28)", pointerEvents: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        <span style={{ fontSize: "11px", color: C.dim, fontFamily: SF }}>{display(min)}</span>
        <span style={{ fontSize: "11px", color: C.dim, fontFamily: SF }}>{display(max)}</span>
      </div>
    </div>
  );
}

function DollarInput({ label, value, onChange, hint }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState("");
  const ref = useRef(null);
  const startEdit = () => { setDraft(String(Math.round(value))); setEditing(true); setTimeout(() => ref.current && ref.current.select(), 0); };
  const commit = () => { const n = parseDollar(draft); if (!isNaN(n) && n >= 0) onChange(n); setEditing(false); };
  const onKey  = e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); };
  return (
    <div style={{ padding: "16px 20px 20px", borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
      <div style={{ fontSize: "12px", color: C.mid, fontFamily: SF, marginBottom: "4px" }}>{label}</div>
      {editing ? (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "22px", color: C.blue, fontFamily: SF, fontWeight: 300 }}>$</span>
          <input ref={ref} inputMode="numeric" value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={onKey}
            style={{ flex: 1, fontSize: "22px", fontWeight: 300, fontFamily: SF, color: C.blue, background: "transparent", border: "none", borderBottom: "2px solid " + C.blue, padding: "2px 0", outline: "none" }} />
        </div>
      ) : (
        <button onClick={startEdit} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0 }}>
          <span style={{ fontSize: "22px", fontWeight: 300, color: C.text, fontFamily: SF }}>{fmt(value)}</span>
          <span style={{ fontSize: "13px", color: C.blue, fontFamily: SF }}>Edit</span>
        </button>
      )}
      {hint && <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, marginTop: "4px" }}>{hint}</div>}
    </div>
  );
}

// ── Amort Tab ─────────────────────────────────────────────────────────────────
function AmortTab({ principal, rate, term, newPI, overlapMonths, recastPI, proceedsApplied, extraPayment, setExtraPayment, loanStartMonth, loanStartYear, setLoanStartMonth, setLoanStartYear, refiEnabled, setRefiEnabled, refiMonth, setRefiMonth, refiYear, setRefiYear, refiRate, setRefiRate, refiTermYears, setRefiTermYears, monthlyEscrow, manualRecasts, setManualRecasts }) {
  const [showRecastVsRefi, setShowRecastVsRefi] = useState(false);
  const [extraMode, setExtraMode]   = useState("monthly"); // "monthly" | "lump"
  const [lumpAmount, setLumpAmount] = useState(5000);
  const [lumpFreq, setLumpFreq]     = useState("annual");  // "quarterly"|"biannual"|"annual"
  const [lumpMonth, setLumpMonth]   = useState(1);
  const mr = rate / 100 / 12;
  const currentYear = new Date().getFullYear();

  const refiMonthIndex = refiEnabled ? (() => {
    const s = new Date(loanStartYear, loanStartMonth - 1, 1);
    const r = new Date(refiYear, refiMonth - 1, 1);
    return Math.max(1, (r.getFullYear() - s.getFullYear()) * 12 + r.getMonth() - s.getMonth());
  })() : null;

  // Build sorted recast event list with month indices
  const recastEvents = manualRecasts
    .filter(rc => rc.enabled && rc.lump > 0)
    .map(rc => {
      const s = new Date(loanStartYear, loanStartMonth - 1, 1);
      const t = new Date(rc.year, rc.month - 1, 1);
      const idx = Math.max(1, (t.getFullYear() - s.getFullYear()) * 12 + t.getMonth() - s.getMonth());
      return { ...rc, idx };
    })
    .sort((a, b) => a.idx - b.idx);

  function getYearDate(yr) {
    const d = new Date(loanStartYear, loanStartMonth - 1 + yr * 12, 1);
    return MONTHS_ABBR[d.getMonth()] + " " + d.getFullYear();
  }
  function localCalcPI(p, r, n) {
    const m = r / 100 / 12;
    if (m === 0 || n <= 0) return p / Math.max(n, 1);
    return (p * m * Math.pow(1 + m, n)) / (Math.pow(1 + m, n) - 1);
  }

  // Lump sum months — find the next occurrence of lumpMonth after loan start
  function getLumpMonths(totalMonths) {
    const freqMap = { quarterly: 3, biannual: 6, annual: 12 };
    const freq = freqMap[lumpFreq] || 12;
    const months = new Set();
    // How many months from loan start until we first hit lumpMonth
    // e.g. loan starts June (6), lump month March (3) → next March is 9 months away
    // e.g. loan starts June (6), lump month August (8) → next August is 2 months away
    // e.g. loan starts June (6), lump month June (6) → first hit at freq months (next cycle)
    let diff = lumpMonth - loanStartMonth;
    if (diff <= 0) diff += 12; // always push to next occurrence, never month 0
    // For non-annual frequencies, first hit is at diff, then every freq months
    // But if freq < 12 we may hit the chosen month multiple times per year
    // Simplest correct approach: start at diff, step by freq
    for (let m = diff; m <= totalMonths; m += freq) months.add(m);
    return months;
  }

  function buildSchedule(extraMonthly, applyLump) {
    let bal = principal, month = 0, tot = 0;
    let cPI = newPI, cMR = mr;
    let rcD = false, rfD = false;
    const rcEvents = [...recastEvents];
    const cap = term * 12 + (refiEnabled ? refiTermYears * 12 : 0);
    const lumpMonthSet = applyLump ? getLumpMonths(cap) : new Set();
    const rows = [];

    while (bal > 0.01 && month < cap) {
      let rcY = false, rfY = false, mrYears = [];
      for (let m = 0; m < 12 && bal > 0.01 && month < cap; m++) {
        if (!rcD && month === overlapMonths) {
          bal = Math.max(0, bal - proceedsApplied);
          cPI = recastPI > 0 ? recastPI : cPI;
          rcD = true; rcY = true;
        }
        if (refiEnabled && !rfD && refiMonthIndex !== null && month === refiMonthIndex) {
          cMR = refiRate / 100 / 12;
          cPI = localCalcPI(bal, refiRate, refiTermYears * 12);
          rfD = true; rfY = true;
        }
        while (rcEvents.length > 0 && rcEvents[0].idx === month) {
          const ev = rcEvents.shift();
          bal = Math.max(0, bal - ev.lump);
          cPI = localCalcPI(bal, rate, cap - month);
          mrYears.push(ev.id);
        }
        const lumpExtra = lumpMonthSet.has(month) ? lumpAmount : 0;
        const totalExtra = extraMonthly + lumpExtra;
        const ic = bal * cMR;
        const princPaid = Math.min(bal, cPI - ic + totalExtra);
        bal = Math.max(0, bal - princPaid);
        tot += ic;
        month++;
      }
      rows.push({ year: Math.floor(month / 12), balance: Math.round(bal), totalInterestPaid: Math.round(tot), recastThisYear: rcY, refiThisYear: rfY, manualRecastIds: mrYears });
      if (bal < 0.01) break;
    }
    return { rows, finalMonth: month, totalInterest: Math.round(tot) };
  }

  const base      = buildSchedule(0, false);
  const withExtra = extraMode === "monthly"
    ? buildSchedule(extraPayment, false)
    : buildSchedule(0, true);
  const hasExtra  = extraMode === "monthly" ? extraPayment > 0 : lumpAmount > 0;
  const moSaved   = base.finalMonth - withExtra.finalMonth;
  const intSaved  = base.totalInterest - withExtra.totalInterest;
  const yrSaved   = Math.floor(moSaved / 12), moRem = moSaved % 12;

  const refiPayment = refiEnabled && refiMonthIndex !== null ? (() => {
    let b = principal, cMR2 = mr, cPI2 = newPI, rcD = false;
    for (let m = 0; m < refiMonthIndex && b > 0.01; m++) {
      if (!rcD && m === overlapMonths) { b = Math.max(0, b - proceedsApplied); cPI2 = recastPI > 0 ? recastPI : cPI2; rcD = true; }
      const ic = b * cMR2; b = Math.max(0, b - Math.min(b, cPI2 - ic));
    }
    const m2 = refiRate / 100 / 12, n2 = refiTermYears * 12;
    return (m2 === 0 ? b / n2 : (b * m2 * Math.pow(1 + m2, n2)) / (Math.pow(1 + m2, n2) - 1)) + monthlyEscrow;
  })() : null;
  return (
    <div style={{ animation: "fadeIn 0.18s ease" }}>
      <Card>
        <SectionLabel>Loan Start Date</SectionLabel>
        <div style={{ display: "flex", gap: "10px", padding: "0 20px 20px" }}>
          <select value={loanStartMonth} onChange={e => setLoanStartMonth(Number(e.target.value))} style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }}>
            {MONTHS_ABBR.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select value={loanStartYear} onChange={e => setLoanStartYear(Number(e.target.value))} style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }}>
            {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </Card>
      <div style={{ background: C.amberBg, border: "1px solid " + C.amber + "40", borderRadius: "12px", padding: "12px 16px", marginBottom: "8px", fontSize: "14px", color: C.mid, fontFamily: SF, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: C.amber }}>Recast at month {overlapMonths}</span> — proceeds reduce balance · payment {"→"} {fmtFull(recastPI)}/mo
      </div>
      <Card>
        <SectionLabel>Extra Payments</SectionLabel>
        {/* Mode toggle */}
        <div style={{ display: "flex", gap: "8px", padding: "0 20px 16px" }}>
          {[{ id: "monthly", label: "Monthly" }, { id: "lump", label: "Lump Sum" }].map(m => (
            <button key={m.id} onClick={() => setExtraMode(m.id)} style={{ flex: 1, padding: "10px 8px", borderRadius: "10px", border: "none", background: extraMode === m.id ? C.blueBg : "rgba(120,80,160,0.08)", color: extraMode === m.id ? C.blue : C.mid, fontSize: "14px", fontWeight: 600, fontFamily: SF, cursor: "pointer" }}>{m.label}</button>
          ))}
        </div>
        {extraMode === "monthly" && (
          <Field label="Additional principal / mo" value={extraPayment} min={0} max={5000} step={50} onChange={setExtraPayment} display={v => v === 0 ? "None" : "+" + fmt(v) + "/mo"} parse={parseDollar} prefix="$" inputMode="numeric" />
        )}
        {extraMode === "lump" && (
          <>
            <Field label="Lump sum amount" value={lumpAmount} min={500} max={100000} step={500} onChange={setLumpAmount} display={v => fmt(v)} parse={parseDollar} prefix="$" inputMode="numeric" />
            <div style={{ padding: "0 20px 14px", borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: C.mid, fontFamily: SF, marginBottom: "10px" }}>Frequency</div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                {[{ id: "quarterly", label: "Quarterly" }, { id: "biannual", label: "Biannual" }, { id: "annual", label: "Annual" }].map(f => (
                  <button key={f.id} onClick={() => setLumpFreq(f.id)} style={{ flex: 1, padding: "9px 4px", borderRadius: "9px", border: "none", background: lumpFreq === f.id ? C.blueBg : "rgba(120,80,160,0.08)", color: lumpFreq === f.id ? C.blue : C.mid, fontSize: "13px", fontWeight: 600, fontFamily: SF, cursor: "pointer" }}>{f.label}</button>
                ))}
              </div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: C.mid, fontFamily: SF, marginBottom: "8px" }}>Starting month</div>
              <select value={lumpMonth} onChange={e => setLumpMonth(Number(e.target.value))} style={{ width: "100%", padding: "10px 14px", borderRadius: "9px", border: "none", background: "rgba(120,80,160,0.08)", fontFamily: SF, fontSize: "14px", color: C.text, outline: "none" }}>
                {MONTHS_ABBR.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div style={{ padding: "12px 20px 16px", fontSize: "13px", color: C.blue, fontFamily: SF }}>
              {fmt(lumpAmount)} applied {lumpFreq === "quarterly" ? "every 3 months" : lumpFreq === "biannual" ? "every 6 months" : "once per year"} starting in {MONTHS_ABBR[lumpMonth - 1]}
            </div>
          </>
        )}
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 20px 4px", minHeight: "52px" }}>
          <SectionLabel color={C.amber}>Refinance</SectionLabel>
          <Toggle checked={refiEnabled} onChange={setRefiEnabled} />
        </div>
        {refiEnabled && (
          <div style={{ animation: "fadeIn 0.18s ease" }}>
            <div style={{ padding: "0 20px 16px", borderTop: "0.5px solid rgba(60,0,80,0.10)" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.mid, fontFamily: SF, padding: "16px 0 10px" }}>Refinance Date</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <select value={refiMonth} onChange={e => setRefiMonth(Number(e.target.value))} style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }}>
                  {MONTHS_ABBR.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                <select value={refiYear} onChange={e => setRefiYear(Number(e.target.value))} style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }}>
                  {Array.from({ length: 30 }, (_, i) => currentYear + i).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <Field label="New interest rate" value={refiRate} min={2} max={12} step={0.05} onChange={setRefiRate} display={v => v.toFixed(2) + "%"} parse={parseFloat} suffix="%" inputMode="decimal" />
            <div style={{ borderTop: "0.5px solid rgba(60,0,80,0.10)" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.mid, fontFamily: SF, padding: "16px 20px 10px" }}>New Term</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", padding: "0 20px 20px" }}>
                {[10, 15, 20, 25, 30, 40].map(y => (
                  <button key={y} onClick={() => setRefiTermYears(y)} style={{ flex: "1 1 auto", minWidth: "48px", padding: "10px 6px", borderRadius: "10px", border: "none", background: refiTermYears === y ? C.amber : "rgba(120,80,160,0.10)", color: refiTermYears === y ? "#fff" : C.mid, fontSize: "14px", fontWeight: 600, fontFamily: SF, cursor: "pointer" }}>{y}yr</button>
                ))}
              </div>
            </div>
            {refiPayment !== null && (
              <div style={{ background: C.pill, borderRadius: "12px", margin: "0 20px 12px", padding: "16px 20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: C.pillText, fontFamily: SF, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>New payment · {refiTermYears}yr @ {refiRate.toFixed(2)}%{monthlyEscrow > 0 ? " · incl. escrow" : ""}</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: C.pillAccent, fontFamily: SF }}>{fmtFull(refiPayment)}/mo</div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Recast vs Refi modal */}
      {showRecastVsRefi && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(26,14,46,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowRecastVsRefi(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.bg, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: "480px", paddingBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(60,0,80,0.18)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 16px", borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: C.text, fontFamily: SF }}>Recast vs. Refinance</div>
              <button onClick={() => setShowRecastVsRefi(false)} style={{ width: "32px", height: "32px", borderRadius: "16px", background: "rgba(120,80,160,0.10)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke={C.mid} strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ padding: "16px 16px 0" }}>
              <Card>
                <LineItem label="Recast payment" value={fmtFull(recastPI > 0 ? recastPI : newPI)} />
                <LineItem label={"Refi payment (" + refiTermYears + "yr @ " + refiRate.toFixed(2) + "%)"} value={refiPayment ? fmtFull(refiPayment) : "—"} last />
              </Card>
              {refiPayment !== null && (() => {
                const recastSavings = (newPI || 0) - (recastPI > 0 ? recastPI : newPI);
                const refiSavings   = (newPI || 0) - refiPayment;
                const closingCost   = Math.round(principal * 0.025);
                const breakEven     = refiSavings > recastSavings ? Math.round(closingCost / Math.max(0.01, refiSavings - recastSavings)) : null;
                const recastWins    = recastSavings >= refiSavings || breakEven === null;
                return (
                  <div style={{ background: recastWins ? C.greenBg : C.amberBg, borderRadius: "12px", padding: "16px 20px", marginTop: "4px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: recastWins ? C.green : C.amber, fontFamily: SF, marginBottom: "6px" }}>
                      {recastWins ? "✓ Recast is the better move" : "⚡ Refinancing saves more per month"}
                    </div>
                    <div style={{ fontSize: "13px", color: recastWins ? C.green : C.amber, fontFamily: SF, lineHeight: 1.6 }}>
                      {recastWins
                        ? "Recast keeps your current rate with no closing costs. Refinancing doesn't save enough to justify ~" + fmt(closingCost) + " in closing costs at these rates."
                        : "Refinancing saves " + fmtFull(refiSavings - recastSavings) + "/mo more than recasting, but costs ~" + fmt(closingCost) + " to close. Break-even: " + breakEven + " months."}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      {hasExtra && (
        <Card style={{ marginBottom: "12px" }}>
          <div style={{ padding: "18px 20px 6px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: C.green, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>Savings from extra payments</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, marginBottom: "4px" }}>Time saved</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: C.green, fontFamily: SF }}>{yrSaved > 0 ? yrSaved + "yr " : ""}{moRem > 0 ? moRem + "mo" : yrSaved > 0 ? "" : moSaved + "mo"}</div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, marginBottom: "4px" }}>Interest saved</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: C.green, fontFamily: SF }}>{fmt(intSaved)}</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "0.5px solid rgba(60,0,80,0.10)", marginTop: "16px" }}>
            <div style={{ padding: "14px 20px", borderRight: "0.5px solid rgba(60,0,80,0.10)" }}>
              <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, marginBottom: "3px" }}>Original payoff</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: C.text, fontFamily: SF }}>{getYearDate(Math.ceil(base.finalMonth / 12))}</div>
            </div>
            <div style={{ padding: "14px 20px" }}>
              <div style={{ fontSize: "12px", color: C.green, fontFamily: SF, marginBottom: "3px" }}>With extra payments</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: C.green, fontFamily: SF }}>{getYearDate(Math.ceil(withExtra.finalMonth / 12))}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Multi-recast cards */}
      {manualRecasts.map((rc, idx) => (
        <Card key={rc.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 20px 4px", minHeight: "52px" }}>
            <SectionLabel color={C.green}>Future Recast {manualRecasts.length > 1 ? idx + 1 : ""}</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {manualRecasts.length > 1 && (
                <button onClick={() => setManualRecasts(manualRecasts.filter(r => r.id !== rc.id))} style={{ background: "none", border: "none", color: C.dim, fontSize: "18px", cursor: "pointer", padding: "0 4px" }}>×</button>
              )}
              <Toggle checked={rc.enabled} onChange={v => setManualRecasts(manualRecasts.map(r => r.id === rc.id ? { ...r, enabled: v } : r))} />
            </div>
          </div>
          {rc.enabled && (
            <div style={{ animation: "fadeIn 0.18s ease", borderTop: "0.5px solid rgba(60,0,80,0.10)" }}>
              <div style={{ padding: "16px 20px 0" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.mid, fontFamily: SF, marginBottom: "10px" }}>Recast Date</div>
                <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                  <select value={rc.month} onChange={e => setManualRecasts(manualRecasts.map(r => r.id === rc.id ? { ...r, month: Number(e.target.value) } : r))} style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }}>
                    {MONTHS_ABBR.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                  <select value={rc.year} onChange={e => setManualRecasts(manualRecasts.map(r => r.id === rc.id ? { ...r, year: Number(e.target.value) } : r))} style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }}>
                    {Array.from({ length: 40 }, (_, i) => currentYear + i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <Field label="Lump sum to apply" value={rc.lump} min={1000} max={500000} step={1000} onChange={v => setManualRecasts(manualRecasts.map(r => r.id === rc.id ? { ...r, lump: v } : r))} display={v => fmt(v)} parse={parseDollar} prefix="$" inputMode="numeric" />
              {rc.lump > 0 && (
                <div style={{ background: C.greenBg, borderRadius: "12px", margin: "0 20px 20px", padding: "14px 20px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.green, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Recast at {MONTHS_ABBR[rc.month - 1]} {rc.year}</div>
                  <div style={{ fontSize: "14px", color: C.mid, fontFamily: SF }}>{fmt(rc.lump)} applied · payment recalculated at same rate</div>
                </div>
              )}
            </div>
          )}
        </Card>
      ))}

      {/* Add recast button */}
      {manualRecasts.length < 10 && (
        <button onClick={() => setManualRecasts([...manualRecasts, { id: Date.now(), enabled: true, month: new Date().getMonth() + 1, year: new Date().getFullYear() + manualRecasts.length + 2, lump: 10000 }])}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "12px 16px", background: C.greenBg, border: "1px solid " + C.green + "40", borderRadius: "12px", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: C.green, fontFamily: SF, marginBottom: "12px" }}>
          + Add Recast
        </button>
      )}

      {/* Compare button — full width like Refinance/Future Recast pills */}
      <button onClick={() => setShowRecastVsRefi(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "6px 16px", background: C.amberBg, border: "1px solid " + C.amber + "40", borderRadius: "12px", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: C.amber, fontFamily: SF, marginBottom: "12px" }}>
        ⚖️ Compare Recast vs. Refinance
      </button>

      {/* Color legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "0 0 12px", alignItems: "center" }}>
        {[
          { color: C.blue,  bg: C.blueBg,  border: C.blue,  label: "Proceeds Recast" },
          { color: C.green, bg: C.greenBg, border: C.green, label: "Future Recast" },
          { color: C.amber, bg: C.amberBg, border: C.amber, label: "Refinance" },
        ].map(({ color, bg, border, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", background: bg, border: "1px solid " + border + "40", borderRadius: "8px", padding: "6px 10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color, fontFamily: SF }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Amortization table */}
      <Card style={{ marginBottom: "12px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: hasExtra ? "36px 48px 1fr 1fr 1fr" : "36px 48px 1fr 1fr", gap: "8px", padding: "12px 20px", background: `linear-gradient(135deg,${C.blue},#8b1a8f)` }}>
          {["Yr", "Date", "Balance", ...(hasExtra ? ["+Extra"] : []), "Int Paid"].map(h => (
            <div key={h} style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", fontFamily: SF, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: h === "Yr" || h === "Date" ? "left" : "right" }}>{h}</div>
          ))}
        </div>
        {/* Rows */}
        {base.rows.map((row, i) => {
          const eRow = withExtra.rows[i];
          const isPaid = hasExtra && !eRow;
          const eBal = eRow ? eRow.balance : 0;
          return (
            <div key={row.year}>
              {row.recastThisYear && (
                <div style={{ background: C.blueBg, padding: "8px 20px", borderBottom: "0.5px solid rgba(192,22,106,0.15)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.blue, fontFamily: SF }}>Proceeds Recast — payment drops to {fmtFull(recastPI)}/mo</div>
                </div>
              )}
              {row.refiThisYear && (
                <div style={{ background: C.amberBg, padding: "8px 20px", borderBottom: "0.5px solid rgba(196,94,0,0.15)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.amber, fontFamily: SF }}>Refi — {refiRate.toFixed(2)}% · {refiTermYears}yr · {refiPayment ? fmtFull(refiPayment) : "—"}/mo</div>
                </div>
              )}
              {row.manualRecastIds && row.manualRecastIds.length > 0 && (
                <div style={{ background: C.greenBg, padding: "8px 20px", borderBottom: "0.5px solid rgba(11,143,143,0.15)" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: C.green, fontFamily: SF }}>Future Recast — payment recalculated</div>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: hasExtra ? "36px 48px 1fr 1fr 1fr" : "36px 48px 1fr 1fr", gap: "8px", padding: "13px 20px", background: i % 2 === 0 ? "#fff" : "rgba(120,80,160,0.04)", borderBottom: "0.5px solid rgba(60,0,80,0.07)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: C.blue, fontFamily: SF }}>{row.year}</div>
                <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF }}>{getYearDate(row.year)}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: C.text, fontFamily: SF, textAlign: "right" }}>{row.balance < 1 ? <span style={{ color: C.green }}>✓</span> : fmt(row.balance)}</div>
                {hasExtra && <div style={{ fontSize: "13px", fontWeight: 600, fontFamily: SF, textAlign: "right", color: isPaid || eBal < row.balance ? C.green : C.text }}>{isPaid ? "✓" : fmt(eBal)}</div>}
                <div style={{ fontSize: "13px", color: C.dim, fontFamily: SF, textAlign: "right" }}>{fmt(row.totalInterestPaid)}</div>
              </div>
            </div>
          );
        })}
      </Card>

      {/* Summary card */}
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
          <div style={{ padding: "18px 20px", borderRight: "0.5px solid rgba(60,0,80,0.10)" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: C.dim, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Total interest</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: C.red, fontFamily: SF }}>{fmt(base.totalInterest)}</div>
            {hasExtra && <div style={{ fontSize: "13px", fontWeight: 600, color: C.green, fontFamily: SF, marginTop: "4px" }}>{fmt(withExtra.totalInterest)} w/ extra</div>}
          </div>
          <div style={{ padding: "18px 20px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: C.dim, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Payoff date</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: C.text, fontFamily: SF }}>{getYearDate(Math.ceil(base.finalMonth / 12))}</div>
            {hasExtra && <div style={{ fontSize: "13px", fontWeight: 600, color: C.green, fontFamily: SF, marginTop: "4px" }}>{getYearDate(Math.ceil(withExtra.finalMonth / 12))} w/ extra</div>}
          </div>
        </div>
        <div style={{ padding: "14px 20px" }}>
          <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, textAlign: "center" }}>
            {term}yr loan · {rate.toFixed(2)}% · {fmt(principal)} principal
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsScreen({ onClose, profile, setProfile, liveRate }) {
  const upd = (k, v) => {
    const next = { ...profile, [k]: v };
    setProfile(next);
    lsSet(PROFILE_KEY, next);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,14,46,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.bg, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: "480px", maxHeight: "92vh", overflowY: "auto" }}>

        {/* Sheet handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(60,0,80,0.18)" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 20px" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: C.text, fontFamily: SF }}>Profile & Settings</div>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "16px", background: "rgba(120,80,160,0.10)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke={C.mid} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: "0 16px 48px" }}>

          {/* Your Name */}
          <Card>
            <SectionLabel>Your Name</SectionLabel>
            <div style={{ display: "flex", gap: "10px", padding: "0 20px 20px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: C.mid, fontFamily: SF, marginBottom: "8px" }}>First Name</div>
                <input value={profile.firstName || ""} onChange={e => upd("firstName", e.target.value)} placeholder="Jane"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: C.mid, fontFamily: SF, marginBottom: "8px" }}>Last Name</div>
                <input value={profile.lastName || ""} onChange={e => upd("lastName", e.target.value)} placeholder="Smith"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          </Card>

          {/* Buyer Type */}
          <Card>
            <SectionLabel>Profile Type</SectionLabel>
            <div style={{ display: "flex", gap: "8px", padding: "0 20px 20px" }}>
              {[{ id: "homebuyer", label: "Homebuyer" }, { id: "agent", label: "Agent" }].map(o => (
                <button key={o.id} onClick={() => upd("buyerType", o.id)} style={{ flex: 1, padding: "12px 8px", borderRadius: "10px", border: "none", background: profile.buyerType === o.id ? C.blueBg : "rgba(120,80,160,0.08)", color: profile.buyerType === o.id ? C.blue : C.mid, fontSize: "14px", fontWeight: 600, fontFamily: SF, cursor: "pointer" }}>{o.label}</button>
              ))}
            </div>
          </Card>

          {/* Financial Profile */}
          <Card>
            <SectionLabel>Financial Profile</SectionLabel>
            <div style={{ padding: "0 20px 16px", borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: C.mid, fontFamily: SF, marginBottom: "8px" }}>Gross Monthly Income</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "18px", color: C.blue, fontFamily: SF, fontWeight: 300 }}>$</span>
                <input type="number" value={profile.grossMonthlyIncome || ""} onChange={e => upd("grossMonthlyIncome", Number(e.target.value))} placeholder="e.g. 7500" inputMode="numeric"
                  style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }} />
              </div>
            </div>
            <div style={{ padding: "16px 20px 16px", borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: C.mid, fontFamily: SF, marginBottom: "8px" }}>Monthly Debts</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "18px", color: C.blue, fontFamily: SF, fontWeight: 300 }}>$</span>
                <input type="number" value={profile.monthlyDebts || ""} onChange={e => upd("monthlyDebts", Number(e.target.value))} placeholder="e.g. 500" inputMode="numeric"
                  style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }} />
              </div>
            </div>
            <div style={{ padding: "16px 20px 20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: C.mid, fontFamily: SF, marginBottom: "12px" }}>Credit Score Range</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {Object.keys(CREDIT_ADJ).map(r => (
                  <button key={r} onClick={() => upd("creditRange", r)} style={{ padding: "10px 14px", borderRadius: "10px", border: "none", background: profile.creditRange === r ? C.blueBg : "rgba(120,80,160,0.08)", color: profile.creditRange === r ? C.blue : C.mid, fontSize: "13px", fontWeight: 600, fontFamily: SF, cursor: "pointer" }}>{r}</button>
                ))}
              </div>
            </div>
          </Card>

          {/* Market Rates */}
          {liveRate && (
            <Card>
              <SectionLabel>Current Market Rates</SectionLabel>
              <div style={{ padding: "0 20px 20px" }}>
                <div style={{ fontSize: "15px", color: C.mid, fontFamily: SF, marginBottom: "6px" }}>
                  30-yr base: <strong style={{ color: C.blue }}>{liveRate.rate30}%</strong>{"  ·  "}15-yr base: <strong style={{ color: C.blue }}>{liveRate.rate15}%</strong>
                </div>
                <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, lineHeight: 1.5 }}>
                  Adjusted in-app for your credit score and loan term · averaged from 20+ lenders
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
// ── Help Modal ────────────────────────────────────────────────────────────────
const HELP = {
  new: {
    title: "New Home",
    sections: [
      { heading: "Home Price", body: "Enter the purchase price of the home you're buying. Drag the slider or tap the value to type. This drives your loan amount, down payment, and monthly payment." },
      { heading: "Down Payment", body: "The amount you pay upfront. Toggle between % and $ — both update the same value. A higher down payment lowers your loan, reduces your rate, and eliminates PMI once you reach 20%." },
      { heading: "PMI (Private Mortgage Insurance)", body: "Required when your down payment is under 20%. It protects the lender if you default. PMI is added to your monthly payment automatically and removed once you reach 20% equity. The national average is around 0.85% per year of the loan balance." },
      { heading: "Interest Rate", body: "Your annual mortgage rate. The rate shown is estimated from your credit score, loan term, and current market data averaged across 20+ lenders. You can override it manually for any scenario." },
      { heading: "Loan Term", body: "How many years to repay the loan. Shorter terms (10, 15yr) mean higher payments but far less total interest. Longer terms (30, 40yr) lower your payment but cost more over time. The 40yr is a non-QM product available from select lenders." },
      { heading: "Include Escrow", body: "When on, your payment includes property tax and homeowner's insurance — the full PITI (Principal, Interest, Tax, Insurance). Tax is estimated from your selected county. Turn off to see P&I only." },
      { heading: "County Lookup", body: "Select your state, then type your county name. This fills in the local property tax rate for escrow. If your county isn't found, the app uses the state average." },
      { heading: "Affordability Mode", body: "Work backwards from a maximum monthly payment. Enter what you can afford per month and the app calculates the home price you can reach at your current rate, term, and down payment." },
    ]
  },
  bridge: {
    title: "Overlap Period",
    sections: [
      { heading: "What is the Overlap Period?", body: "If you buy before selling, there's a period — usually 1–6 months — where you carry both mortgages. This screen shows the full cost of that overlap." },
      { heading: "Current Monthly Costs", body: "Enter your existing mortgage payment plus utilities on the old home. This gives you the real combined monthly burden during the overlap." },
      { heading: "Overlap Length", body: "How many months you expect to carry both properties. Be conservative — hot markets close in 30–60 days, slower markets can take longer. Plan for 6 months and be pleasantly surprised." },
      { heading: "Total Overlap Cost", body: "Combined monthly cost multiplied by the overlap period. This money doesn't build equity — it's purely the cost of transition. Minimizing this is why buyers try to time their sale and purchase closely." },
    ]
  },
  recast: {
    title: "Sell",
    sections: [
      { heading: "Sale Price", body: "The price you expect to sell your current home for. The market check compares this against local price-per-sqft data to flag whether you're priced fair, above market, or overpriced." },
      { heading: "Selling Costs", body: "Typically 8–10% of sale price. This includes: closing costs (1–3%), your listing agent (2–3%), buyer's agent (2–3%), and any concessions. Each line is adjustable individually." },
      { heading: "Current Mortgage Payoff", body: "The remaining balance on your existing mortgage — what you still owe. It gets deducted from your sale proceeds along with selling costs. What's left is your net proceeds." },
      { heading: "Net Proceeds", body: "Sale price minus selling costs minus your mortgage payoff. This is the cash you walk away with after closing — available to apply toward your down payment, a recast, or kept as cash." },
      { heading: "What is Recasting?", body: "Recasting means paying a large lump sum toward your new mortgage principal, then asking the lender to recalculate your monthly payment over the remaining term at the same rate. You keep your rate but your payment drops. Most lenders charge $150–500 and require a minimum lump sum of $5,000–10,000." },
      { heading: "Recast vs. Refinancing", body: "A refinance replaces your loan with a new one at a new rate — resets your term and costs $3,000–6,000 in closing costs. A recast keeps your existing loan and rate, just lowers the payment. If you have a good rate, recasting wins. If rates have dropped significantly, refinancing may make more sense." },
      { heading: "Apply Proceeds to Down Payment", body: "In Sell First mode, your net proceeds can flow directly into your new home's down payment. Toggle this on and watch your down payment, loan amount, and PMI status update live." },
    ]
  },
  amort: {
    title: "Amortization",
    sections: [
      { heading: "What is Amortization?", body: "Amortization is how your loan pays down over time. Early years are mostly interest. As the balance drops, more goes to principal. The table shows year-end balances and cumulative interest paid at each point." },
      { heading: "Loan Start Date", body: "Set when your loan begins. This anchors the entire schedule — payoff dates, recast timing, and refinance dates all calculate from here." },
      { heading: "Extra Payments — Monthly", body: "Toggle to Monthly mode and set an additional principal amount. This goes directly to your balance every month. Even $100–200/month can shave years off your loan and save tens of thousands in interest. The savings card shows exactly how much time and money you save." },
      { heading: "Extra Payments — Lump Sum", body: "Toggle to Lump Sum mode to model periodic large payments — quarterly, biannual, or annual. Set the amount and the starting month. Great for year-end bonuses or tax refunds. The schedule applies the lump directly to principal at the chosen frequency." },
      { heading: "🔴  Proceeds Recast (Pink)", body: "In Buy First mode, when you sell your current home and apply the net proceeds to your new mortgage, a pink event row appears in the table at that date. This is the automatic recast — your balance drops by the proceeds amount and your payment recalculates at the same rate. Everything after the pink row reflects the lower payment." },
      { heading: "🟢  Future Recast (Green) — Up to 10", body: "Add up to 10 future recasts, each with its own date and lump sum. On that date, the lump reduces your balance and your payment is recalculated at the same rate for the remaining term — no closing costs, no new loan. Tap '+ Add Recast' to stack additional recasts. Each appears as a green event row in the table. Stack multiple recasts to model a strategy of gradually lowering your payment over time." },
      { heading: "🟡  Refinance (Amber)", body: "Toggle Refinance to model replacing your loan at a future date with a new rate and term. An amber event row marks it in the table. The schedule rebuilds from that point using the new terms. Unlike recasting, refinancing involves closing costs ($3,000–6,000 typically) and resets your loan term." },
      { heading: "Reading the Color Codes", body: "Pink row = proceeds recast from your home sale.\nGreen row = your manually scheduled future recast.\nAmber row = refinance.\n\nYou can have all three in the same schedule. They apply in chronological order — each one rebuilds the schedule from that point forward." },
      { heading: "Total Interest", body: "The summary card shows total interest over the loan's life — often a surprising number. Extra payments, recasts, and shorter terms all chip away at it. The 'with extra' column shows your savings side by side." },
    ]
  },
  resale: {
    title: "Resale",
    sections: [
      { heading: "Age of Home at Sale", body: "Older homes typically sell at a modest discount to newer ones. The multiplier adjusts your projected price based on typical market behavior. Newer homes (0–5 yrs) command a premium; older homes (20+ yrs) often sell at a slight discount unless extensively updated." },
      { heading: "Pricing Mode", body: "Today's Market uses current local price-per-sqft data to estimate value now. The Appreciation projection assumes 2.5% annual growth from your purchase price — a conservative long-term US average." },
      { heading: "Price Per Sqft", body: "Enter your home's square footage and the app estimates its market value using county-level data. This is a ballpark — actual value depends on condition, exact location, and recent comparable sales." },
      { heading: "Projected Sale Date", body: "Choose when you expect to sell. This sets how long you've owned, which affects appreciation and how far along your amortization schedule you'll be." },
      { heading: "Net Proceeds at Resale", body: "Projected sale price minus selling costs minus your remaining mortgage balance at that date. This is your equity realized — what you'd actually walk away with." },
      { heading: "Equity Gain", body: "Net proceeds minus your original purchase price. Positive means the investment paid off above what you put in. Factor in cumulative mortgage payments for the full cost of homeownership picture." },
    ]
  },
  summary: {
    title: "Summary",
    sections: [
      { heading: "The Six Tiles", body: "A live snapshot: monthly payment, loan amount, total interest, down payment, net sale proceeds, and equity at resale. Everything updates as you change any input on any tab." },
      { heading: "Saving a Scenario", body: "Tap Save to bookmark your current inputs. Saved scenarios appear behind the floppy disk icon at the top. Save up to 10 and compare any 3 side by side." },
      { heading: "Comparing Scenarios", body: "After saving 2+, tap Compare in the scenarios sheet. Pick A/B/C — the table shows every metric side by side with color-coded deltas. Green means better, red means worse. The winner row highlights the lowest post-recast monthly payment." },
      { heading: "DTI & Rate Adjustment", body: "If you've entered income and debts in your profile, your rate reflects a debt-to-income adjustment. Under 36% DTI gets the best rate. Over 43% adds a bump — fewer lenders will qualify you and those that do charge more." },
    ]
  },
};

function HelpModal({ tab, onClose }) {
  const [openIdx, setOpenIdx] = useState(null);
  const content = HELP[tab] || HELP.new;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,14,46,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.bg, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: "480px", maxHeight: "82vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0", flexShrink: 0 }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "rgba(60,0,80,0.18)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 16px", flexShrink: 0, borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: C.blue, fontFamily: SF, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "3px" }}>{content.title}</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: C.text, fontFamily: SF }}>How does this work?</div>
          </div>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "16px", background: "rgba(120,80,160,0.10)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke={C.mid} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 16px 40px" }}>
          <Card>
            {content.sections.map((s, i) => {
              const isOpen = openIdx === i;
              const isLast = i === content.sections.length - 1;
              return (
                <div key={i}>
                  <button onClick={() => setOpenIdx(isOpen ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", background: "none", border: "none", cursor: "pointer", borderBottom: (!isOpen && !isLast) ? "0.5px solid rgba(60,0,80,0.10)" : "none", textAlign: "left", gap: "12px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: isOpen ? C.blue : C.text, fontFamily: SF, flex: 1 }}>{s.heading}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isOpen ? C.blue : C.dim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "4px 20px 18px", borderBottom: isLast ? "none" : "0.5px solid rgba(60,0,80,0.10)", animation: "fadeIn 0.15s ease" }}>
                      <div style={{ fontSize: "14px", color: C.mid, fontFamily: SF, lineHeight: 1.7 }}>{s.body}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}


// ── Scenario Compare ──────────────────────────────────────────────────────────
// ── Scenario Compare — up to 3, with deltas ───────────────────────────────────
function ScenarioCompare({ scenarios, onClose }) {
  const [selected, setSelected] = useState([0, Math.min(1, scenarios.length - 1)]);

  const toggle = i => {
    if (selected.includes(i)) {
      if (selected.length > 2) setSelected(selected.filter(x => x !== i));
    } else {
      if (selected.length < 3) setSelected([...selected, i]);
    }
  };

  const cols = selected.map(i => scenarios[i]).filter(Boolean);
  const base = cols[0];

  const numVal = (s, key) => {
    if (!s) return null;
    if (key === "homePrice") return s.homePrice;
    if (key === "downPct")   return s.downPct;
    if (key === "rate")      return s.rate;
    if (key === "term")      return s.term;
    if (key === "newTotal")  return s.calcSnapshot && s.calcSnapshot.newTotal;
    if (key === "recastTotal") return s.calcSnapshot && s.calcSnapshot.recastTotal;
    if (key === "netProceeds") return s.calcSnapshot && s.calcSnapshot.netProceeds;
    return null;
  };

  const ROWS = [
    { label: "Home Price",       key: "homePrice",    fmt: v => fmt(v),              lowerBetter: true  },
    { label: "Down Payment",     key: "downPct",      fmt: v => v + "%",             lowerBetter: false },
    { label: "Interest Rate",    key: "rate",         fmt: v => v + "%",             lowerBetter: true  },
    { label: "Loan Term",        key: "term",         fmt: v => v + "yr",            lowerBetter: true  },
    { label: "New Mtg / mo",     key: "newTotal",     fmt: v => fmtFull(v),          lowerBetter: true  },
    { label: "After Recast / mo",key: "recastTotal",  fmt: v => fmtFull(v),          lowerBetter: true  },
    { label: "Net Proceeds",     key: "netProceeds",  fmt: v => fmt(v),              lowerBetter: false },
  ];

  const deltaColor = (delta, lowerBetter) => {
    if (Math.abs(delta) < 0.01) return C.dim;
    return (delta < 0) === lowerBetter ? C.green : C.red;
  };

  const fmtDelta = (key, delta) => {
    if (Math.abs(delta) < 0.01) return "—";
    const sign = delta > 0 ? "+" : "";
    if (key === "homePrice" || key === "newTotal" || key === "recastTotal" || key === "netProceeds")
      return sign + fmt(delta);
    if (key === "downPct" || key === "rate")
      return sign + delta.toFixed(2) + "%";
    if (key === "term")
      return sign + delta + "yr";
    return sign + delta;
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, zIndex: 200, overflowY: "auto" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "1.25rem 0.875rem 48px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "18px", fontWeight: 800, color: C.text, fontFamily: SF }}>Compare Scenarios</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", color: C.dim, cursor: "pointer" }}>x</button>
        </div>

        {/* Scenario picker chips */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", color: C.dim, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Select 2 or 3 to compare</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {scenarios.map((s, i) => {
              const on = selected.includes(i);
              const idx = selected.indexOf(i);
              const labels = ["A", "B", "C"];
              return (
                <button key={i} onClick={() => toggle(i)} style={{ padding: "9px 16px", borderRadius: "20px", border: `1.5px solid ${on ? C.blue : C.border}`, background: on ? C.blueBg : C.card, color: on ? C.blue : C.dim, fontSize: "11px", fontWeight: 700, fontFamily: SF, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                  {on && <span style={{ background: C.blue, color: "#fff", borderRadius: "50%", width: "14px", height: "14px", fontSize: "11px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{labels[idx]}</span>}
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>

        {cols.length < 2 && (
          <div style={{ textAlign: "center", padding: "32px", color: C.dim, fontFamily: SF, fontSize: "12px" }}>Select at least 2 scenarios above to compare</div>
        )}

        {cols.length >= 2 && (
          <Card>
            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: `1fr ${cols.map(() => "1fr").join(" ")}`, gap: "8px", padding: "12px 20px", borderBottom: "0.5px solid rgba(60,0,80,0.10)", background: "rgba(120,80,160,0.06)" }}>
              <div style={{ fontSize: "11px", color: C.dim, fontFamily: SF, textTransform: "uppercase" }}>Metric</div>
              {cols.map((s, ci) => (
                <div key={ci} style={{ fontSize: "11px", fontWeight: 700, color: C.blue, fontFamily: SF, textAlign: "right" }}>
                  {["A","B","C"][ci]} · {s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name}
                </div>
              ))}
            </div>

            {ROWS.map(row => {
              const vals = cols.map(s => numVal(s, row.key));
              const baseVal = vals[0];
              return (
                <div key={row.key} style={{ display: "grid", gridTemplateColumns: `1fr ${cols.map(() => "1fr").join(" ")}`, gap: "4px", padding: "0.55rem 12px", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
                  <div style={{ fontSize: "11px", color: C.mid, fontFamily: SF }}>{row.label}</div>
                  {cols.map((_, ci) => {
                    const v = vals[ci];
                    const delta = ci > 0 && baseVal != null && v != null ? v - baseVal : null;
                    return (
                      <div key={ci} style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: C.text, fontFamily: SF }}>{v != null ? row.fmt(v) : "—"}</div>
                        {delta !== null && (
                          <div style={{ fontSize: "11px", fontWeight: 600, color: deltaColor(delta, row.lowerBetter), fontFamily: SF }}>{fmtDelta(row.key, delta)}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Winner row */}
            {cols.length >= 2 && (
              <div style={{ padding: "0.65rem 12px", background: C.greenBg, borderTop: `1px solid ${C.greenBorder}` }}>
                <div style={{ fontSize: "11px", color: C.green, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Lowest monthly payment after recast</div>
                {(() => {
                  const payments = cols.map(s => s.calcSnapshot && s.calcSnapshot.recastTotal || Infinity);
                  const winIdx   = payments.indexOf(Math.min(...payments));
                  return <div style={{ fontSize: "14px", fontWeight: 800, color: C.green, fontFamily: SF }}>{"ABC"[winIdx]} — {cols[winIdx].name} · {fmtFull(payments[winIdx])}/mo</div>;
                })()}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

// ── Scenario Viewer — full app overlay for a saved scenario ───────────────────
function ScenarioViewer({ scenario, onClose, onUpdate, onSaveNew }) {
  const [viewTab, setViewTab] = useState("new");
  const s = scenario;

  // Summary tile colors
  const tiles = [
    { color: "#c0166a", label: "New Mtg / mo",    val: s.calcSnapshot ? fmtFull(s.calcSnapshot.newTotal)    : "—" },
    { color: "#0b8f8f", label: "After Recast / mo",val: s.calcSnapshot ? fmtFull(s.calcSnapshot.recastTotal) : "—" },
    { color: "#0b6e6e", label: "Net Proceeds",     val: s.calcSnapshot ? fmt(s.calcSnapshot.netProceeds)     : "—" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, zIndex: 200, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", width: "100%", padding: "0 0 48px" }}>

        {/* Header bar */}
        <div style={{ background: `linear-gradient(135deg,#c0166a,#8b1a8f)`, padding: "1rem 1rem 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.1em" }}>Saved Scenario</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", fontFamily: SF, marginTop: "2px" }}>{s.name}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontFamily: SF, marginTop: "3px" }}>
              {fmt(s.homePrice)} · {s.downPct}% dn · {s.rate}% · {s.term}yr · {s.purchaseMode === "firsthome" ? "First Home" : s.purchaseMode === "sellfirst" ? "Sell First" : "Buy First"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", color: "#fff", fontSize: "11px", fontFamily: SF, cursor: "pointer", padding: "0.35rem 10px" }}>Close</button>
        </div>

        {/* Key metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", padding: "0.75rem 14px" }}>
          {tiles.map(({ color, label, val }) => (
            <div key={label} style={{ background: color, borderRadius: "10px", padding: "0.6rem 8px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontFamily: SF, textTransform: "uppercase", marginBottom: "3px" }}>{label}</div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#fff", fontFamily: SF, lineHeight: 1.1 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Full saved data */}
        <div style={{ padding: "0 14px" }}>
          <Card>
            <SectionLabel>Scenario Details</SectionLabel>
            <LineItem label="Home Price"     value={fmt(s.homePrice)} />
            <LineItem label="Down Payment"   value={s.downPct + "% — " + fmt(s.homePrice * s.downPct / 100)} />
            <LineItem label="Interest Rate"  value={s.rate + "%"} />
            <LineItem label="Loan Term"      value={s.term + " years"} />
            <LineItem label="Mode"           value={s.purchaseMode === "firsthome" ? "First Home" : s.purchaseMode === "sellfirst" ? "Sell First" : "Buy First"} />
            <LineItem label="Saved"          value={new Date(s.ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
          </Card>

          {s.calcSnapshot && (
            <Card accent={C.green}>
              <SectionLabel color={C.green}>Snapshot at Save</SectionLabel>
              <LineItem label="New Mortgage / mo"  value={fmtFull(s.calcSnapshot.newTotal)} />
              <LineItem label="After Recast / mo"  value={fmtFull(s.calcSnapshot.recastTotal)} />
              <LineItem label="Net Sale Proceeds"  value={fmt(s.calcSnapshot.netProceeds)} />
            </Card>
          )}

          <div style={{ background: C.pill, border: "none", borderRadius: "10px", padding: "0.65rem 14px", marginBottom: "12px", fontSize: "11px", color: C.pillText, fontFamily: SF, lineHeight: 1.6 }}>
            This is a snapshot of your inputs at the time you saved. To run a full recalculation with these values, tap "Load into App" below.
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button onClick={() => onUpdate(s)} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg,${C.blue},#8b1a8f)`, color: "#fff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 800, fontFamily: SF, cursor: "pointer" }}>
              Load into App
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: "12px", background: "transparent", color: C.dim, border: "none", borderRadius: "12px", fontSize: "12px", fontFamily: SF, cursor: "pointer" }}>
              Close — Keep Current Work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── County Input — proper component so hooks are valid ────────────────────────
function CountyInput({ stateVal, setStateVal, countyVal, setCountyVal, lookup, label }) {
  const [localVal, setLocalVal] = useState(countyVal);
  const inputRef = useRef(null);
  useEffect(() => { setLocalVal(countyVal); }, [countyVal]);
  const commit = () => setCountyVal(localVal);
  return (
    <div style={{ borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
      {label && <div style={{ fontSize: "12px", fontWeight: 600, color: C.mid, fontFamily: SF, padding: "14px 20px 0" }}>{label}</div>}
      <div style={{ display: "flex", gap: "10px", padding: "10px 20px 16px" }}>
        <select value={stateVal} onChange={e => { setStateVal(e.target.value); setCountyVal(""); setLocalVal(""); }}
          style={{ flex: 1, padding: "10px 12px", borderRadius: "9px", border: "none", background: "rgba(120,80,160,0.08)", fontFamily: SF, fontSize: "14px", color: C.text, outline: "none" }}>
          {Object.keys(TAX_DATA).sort().map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          ref={inputRef}
          value={localVal}
          onChange={e => setLocalVal(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === "Enter") { commit(); inputRef.current && inputRef.current.blur(); } }}
          placeholder="County name..."
          style={{ flex: 1, minWidth: 0, padding: "10px 12px", borderRadius: "9px", border: "none", background: lookup ? "rgba(11,143,143,0.08)" : "rgba(120,80,160,0.08)", fontFamily: SF, fontSize: "14px", color: C.text, outline: "none" }}
        />
      </div>
      {lookup && <div style={{ fontSize: "12px", color: C.green, fontFamily: SF, padding: "0 20px 12px" }}>{"✓"} {lookup.name}{lookup.rate ? " — " + lookup.rate + "% tax" : ""}{lookup.price ? " · $" + lookup.price + "/sqft" : ""}</div>}
    </div>
  );
}


const DEFAULTS = {
  tab: "new",
  purchaseMode: "firsthome", hasCurrentHome: true,
  newHomeState: "Arkansas", newHomeCounty: "", newHomeSqft: 2000,
  saleState: "Arkansas",    saleCounty: "",    saleHomeSqft: 1800,
  affordMode: false,
  applyProceedsToDown: true, additionalDownDollars: 0,
  homePrice: 400000, downPct: 20, downDollars: 80000, downMode: "pct",
  rate: 6.75, term: 30,
  includeEscrow: false, taxRate: 0.84,
  insurance: Math.round((400000 * 1.35) / 100 / 12), insuranceManual: false,
  currentPayment: 1500, currentUtilities: 250, overlapMonths: 6,
  salePrice: 350000, currentBalance: 220000,
  closingCostsPct: 3.14, listingAgentPct: 2.82, buyerAgentPct: 2.84, buyerConcessions: 2.0,
  recastEnabled: true, proceedsApplyPct: 100,
  pmiRate: 0.85, extraPayment: 0,
  sqft: 2000, homeAgeRange: "10-15", pricingMode: "today",
  loanStartMonth: new Date().getMonth() + 1, loanStartYear: new Date().getFullYear(),
  refiEnabled: false, refiMonth: new Date().getMonth() + 1,
  refiYear: new Date().getFullYear() + 3, refiRate: 5.5, refiTermYears: 30,
  resaleMonth: new Date().getMonth() + 1, resaleYear: new Date().getFullYear() + 5,
};

function initV(k) {
  // Try v2 first, then fall back to v1 to preserve existing data
  const s2 = ls(STORAGE_KEY);
  if (s2 && s2[k] !== undefined) return s2[k];
  const s1 = ls("domavi-v1");
  if (s1 && s1[k] !== undefined) return s1[k];
  return DEFAULTS[k];
}

// ── Main App ──────────────────────────────────────────────────────────────────
function TermButtons({ value, onChange, accentColor = C.blue, accentBg = C.blueBg }) {
  return (
    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", padding: "10px 20px 20px" }}>
      {[{ y: 10 }, { y: 15 }, { y: 20 }, { y: 25 }, { y: 30 }, { y: 40, note: "non-QM" }].map(({ y, note }) => (
        <button key={y} onClick={() => onChange(y)} style={{ flex: "1 1 auto", minWidth: "48px", padding: "10px 6px", borderRadius: "8px", border: "none", background: value === y ? accentColor : "rgba(120,80,160,0.10)", color: value === y ? "#fff" : C.mid, fontSize: "14px", fontWeight: value === y ? 600 : 400, fontFamily: SF, cursor: "pointer", lineHeight: 1.2 }}>
          <div>{y}yr</div>
          {note && <div style={{ fontSize: "11px", opacity: 0.75, fontWeight: 400 }}>{note}</div>}
        </button>
      ))}
    </div>
  );
}

// ── Help Drawer — pull tab + slide-out panel ──────────────────────────────────
function HelpDrawer({ tab }) {
  const [open, setOpen]     = useState(false);
  const [openIdx, setOpenIdx] = useState(null);
  const content = HELP[tab] || HELP.new;

  // Reset accordion when tab changes
  useEffect(() => { setOpenIdx(null); }, [tab]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(26,14,46,0.45)", zIndex: 59, backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }} />
      )}

      {/* Drawer panel */}
      <div style={{
        position: "fixed", top: 0, right: open ? 0 : "-88%", bottom: 0,
        width: "88%", maxWidth: "420px",
        background: C.bg, zIndex: 60,
        boxShadow: open ? "-8px 0 40px rgba(26,14,46,0.25)" : "none",
        transition: "right 0.32s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Drawer header */}
        <div style={{ background: `linear-gradient(135deg,${C.blue},#8b1a8f)`, padding: "52px 20px 18px", flexShrink: 0 }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: SF, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>{content.title}</div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff", fontFamily: SF }}>How does this work?</div>
        </div>

        {/* Accordion content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 120px" }}>
          <Card>
            {content.sections.map((s, i) => {
              const isOpen = openIdx === i;
              const isLast = i === content.sections.length - 1;
              return (
                <div key={i}>
                  <button onClick={() => setOpenIdx(isOpen ? null : i)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", background: "none", border: "none", cursor: "pointer", borderBottom: (!isOpen && !isLast) ? "0.5px solid rgba(60,0,80,0.10)" : "none", textAlign: "left", gap: "12px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: isOpen ? C.blue : C.text, fontFamily: SF, flex: 1 }}>{s.heading}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isOpen ? C.blue : C.dim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "4px 20px 18px", borderBottom: isLast ? "none" : "0.5px solid rgba(60,0,80,0.10)", animation: "fadeIn 0.15s ease" }}>
                      <div style={{ fontSize: "14px", color: C.mid, fontFamily: SF, lineHeight: 1.7 }}>{s.body}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Pull tab — always visible, slides with drawer */}
      <div onClick={() => setOpen(o => !o)} style={{
        position: "fixed",
        top: "50%",
        right: open ? "88%" : 0,
        transform: "translateY(-50%)",
        maxRight: open ? "420px" : "0px",
        zIndex: 61,
        cursor: "pointer",
        transition: "right 0.32s cubic-bezier(.4,0,.2,1)",
        display: "flex", alignItems: "center",
      }}>
        <div style={{
          background: `linear-gradient(180deg,${C.blue},#8b1a8f)`,
          borderRadius: "8px 0 0 8px",
          padding: "14px 7px",
          boxShadow: "-3px 0 16px rgba(192,22,106,0.30)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        }}>
          {/* Chevron */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.3s" }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          {/* Vertical text */}
          {"HELP".split("").map((ch, i) => (
            <span key={i} style={{ fontSize: "10px", fontWeight: 700, color: "#fff", fontFamily: SF, letterSpacing: "0.05em", lineHeight: 1 }}>{ch}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function DomaviMortgage() {
  useEffect(() => {
    // PWA home screen icons
    const addLink = (rel, type, sizes, href) => {
      const existing = document.querySelector(`link[rel="${rel}"][sizes="${sizes}"]`);
      if (existing) return;
      const l = document.createElement("link");
      l.rel = rel; l.type = type; if (sizes) l.sizes = sizes; l.href = href;
      document.head.appendChild(l);
    };
    addLink("apple-touch-icon", "image/png", "180x180", "data:image/png;base64,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");
    addLink("icon", "image/png", "192x192", "data:image/png;base64,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");
    // PWA meta
    const addMeta = (name, content) => {
      if (document.querySelector(`meta[name="${name}"]`)) return;
      const m = document.createElement("meta");
      m.name = name; m.content = content;
      document.head.appendChild(m);
    };
    addMeta("apple-mobile-web-app-capable", "yes");
    addMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
    addMeta("apple-mobile-web-app-title", "DOMAVi");
    addMeta("mobile-web-app-capable", "yes");
    addMeta("theme-color", "#c0166a");
  }, []);

  useEffect(() => {
    const id = "vantage-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = "@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}" +
      "@keyframes waveDrift{0%,100%{transform:translateX(0)}50%{transform:translateX(-18px)}}" +
      "*{box-sizing:border-box}" +
      "html,body{background:#f5f0f7;margin:0;padding:0}" +
      "input[type=range]{-webkit-appearance:none;appearance:none}" +
      "::-webkit-scrollbar{display:none}";
    document.head.appendChild(el);
    return () => { const s = document.getElementById(id); if (s) s.remove(); };
  }, []);
  const [profile, setProfile] = useState(() => {
    const saved = ls(PROFILE_KEY) || ls("domavi-profile-v1") || {};
    return { firstName: "", lastName: "", buyerType: "homebuyer", grossMonthlyIncome: 0, monthlyDebts: 0, creditRange: "740-759", maxMonthly: 2000, ...saved };
  });
  const [showSettings,setShowSettings]= useState(false);
  const [showCompare,     setShowCompare]     = useState(false);
  const [showScenarios,   setShowScenarios]   = useState(false);
  const [showSaveModal,   setShowSaveModal]    = useState(false);
  const [scenarioName,    setScenarioName]     = useState("");
  const [viewingScenario, setViewingScenario]  = useState(null);
  const [showAffordModal,setShowAffordModal]=useState(false);
  const [scenarios,   setScenarios]   = useState(() => ls(SCENARIOS_KEY) || []);
  // Rate lookup table: { "30_760+": 6.41, "30_740-759": 6.53, ... }
  const [rateTable, setRateTable] = useState({});
  const [liveRate, setLiveRate]   = useState({ rate30: 6.41, rate15: 5.79, fetched: false });

  useEffect(() => {
    const buildRateTable = async () => {
      try {
        const prompt = `You are a mortgage rate research assistant. Search the web NOW for today's current mortgage rates from at least 20 different lenders and rate aggregators including: Wells Fargo, Chase, Bank of America, Rocket Mortgage, United Wholesale Mortgage, loanDepot, Pennymac, Caliber Home Loans, Guild Mortgage, Fairway Independent, NewRez, Freedom Mortgage, CrossCountry Mortgage, AmeriHome, Nationstar, Quicken Loans, Mr. Cooper, Better.com, SoFi, LendingTree, Bankrate, NerdWallet, Zillow, Realtor.com, and Mortgage News Daily.

For each of the following loan terms: 10, 15, 20, 25, 30, 40 years
And for each credit score tier: 760+, 740-759, 720-739, 700-719, 680-699, 660-679, 640-659, 620-639

Calculate the average interest rate (not APR) across all sources you can find.

Return ONLY a valid JSON object with no other text, markdown, or explanation. Format:
{
  "10_760+": 5.95, "10_740-759": 6.07, "10_720-739": 6.20, "10_700-719": 6.45, "10_680-699": 6.70, "10_660-679": 6.95, "10_640-659": 7.45, "10_620-639": 7.95,
  "15_760+": 5.79, "15_740-759": 5.91, "15_720-739": 6.04, "15_700-719": 6.29, "15_680-699": 6.54, "15_660-679": 6.79, "15_640-659": 7.29, "15_620-639": 7.79,
  "20_760+": 6.15, "20_740-759": 6.27, "20_720-739": 6.40, "20_700-719": 6.65, "20_680-699": 6.90, "20_660-679": 7.15, "20_640-659": 7.65, "20_620-639": 8.15,
  "25_760+": 6.28, "25_740-759": 6.40, "25_720-739": 6.53, "25_700-719": 6.78, "25_680-699": 7.03, "25_660-679": 7.28, "25_640-659": 7.78, "25_620-639": 8.28,
  "30_760+": 6.41, "30_740-759": 6.53, "30_720-739": 6.66, "30_700-719": 6.91, "30_680-699": 7.16, "30_660-679": 7.41, "30_640-659": 7.91, "30_620-639": 8.41,
  "40_760+": 6.71, "40_740-759": 6.83, "40_720-739": 6.96, "40_700-719": 7.21, "40_680-699": 7.46, "40_660-679": 7.71, "40_640-659": 8.21, "40_620-639": 8.71,
  "sources": 20,
  "date": "2026-05-08"
}
Use current real rates from your web search. The values in the template above are fallbacks only — replace them with real averaged data.`;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
            tools: [{ type: "web_search_20250305", name: "web_search" }]
          })
        });
        const data = await res.json();
        const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const table = JSON.parse(match[0]);
          setRateTable(table);
          setLiveRate({
            rate30: table["30_760+"] || 6.41,
            rate15: table["15_760+"] || 5.79,
            fetched: true,
            sources: table.sources || 0,
            date: table.date || ""
          });
        }
      } catch (e) {
        // Keep fallback rates silently
      }
    };
    buildRateTable();
  }, []);

  // Core state
  const [tab,            setTab]           = useState(() => initV("tab"));
  const goToTab = id => { window.scrollTo({ top: 0, behavior: "instant" }); setTab(id); };
  const [purchaseMode,   setPurchaseMode]  = useState(() => initV("purchaseMode"));
  const [hasCurrentHome, setHasCurrentHome]= useState(() => initV("hasCurrentHome"));
  const [homePrice,      setHomePrice]     = useState(() => initV("homePrice"));
  const [downPct,        setDownPct]       = useState(() => initV("downPct"));
  const [downDollars,    setDownDollars]   = useState(() => initV("downDollars"));
  const [downMode,       setDownMode]      = useState(() => initV("downMode"));
  const [rate,           setRate]          = useState(() => initV("rate"));
  const [term,           setTerm]          = useState(() => initV("term"));
  const [includeEscrow,  setIncludeEscrow] = useState(() => initV("includeEscrow"));
  const [taxRate,        setTaxRate]       = useState(() => initV("taxRate"));
  const [insurance,      setInsurance]     = useState(() => initV("insurance"));
  const [insuranceManual,setInsuranceManual]=useState(() => initV("insuranceManual"));
  const [newHomeState,   setNewHomeState]  = useState(() => initV("newHomeState") || "Arkansas");
  const [newHomeCounty,  setNewHomeCounty] = useState(() => initV("newHomeCounty") || "");
  const [newHomeSqft,    setNewHomeSqft]   = useState(() => initV("newHomeSqft"));
  const [saleState,      setSaleState]     = useState(() => initV("saleState") || "Arkansas");
  const [saleCounty,     setSaleCounty]    = useState(() => initV("saleCounty") || "");
  const [saleHomeSqft,   setSaleHomeSqft]  = useState(() => initV("saleHomeSqft"));
  const [affordMode,     setAffordMode]    = useState(() => initV("affordMode") || false);
  const [applyProceedsToDown,setApplyProceedsToDown]=useState(() => initV("applyProceedsToDown") !== false);
  const [additionalDownDollars,setAdditionalDownDollars]=useState(() => initV("additionalDownDollars") || 0);
  const [currentPayment, setCurrentPayment]= useState(() => initV("currentPayment"));
  const [currentUtilities,setCurrentUtilities]=useState(() => initV("currentUtilities"));
  const [overlapMonths,  setOverlapMonths] = useState(() => initV("overlapMonths"));
  const [salePrice,      setSalePrice]     = useState(() => initV("salePrice"));
  const [currentBalance, setCurrentBalance]= useState(() => initV("currentBalance"));
  const [closingCostsPct,setClosingCostsPct]=useState(() => initV("closingCostsPct"));
  const [listingAgentPct,setListingAgentPct]=useState(() => initV("listingAgentPct"));
  const [buyerAgentPct,  setBuyerAgentPct] = useState(() => initV("buyerAgentPct"));
  const [buyerConcessions,setBuyerConcessions]=useState(() => initV("buyerConcessions"));
  const [recastEnabled,  setRecastEnabled] = useState(() => initV("recastEnabled"));
  const [proceedsApplyPct,setProceedsApplyPct]=useState(() => initV("proceedsApplyPct"));
  const [pmiRate,        setPmiRate]       = useState(() => initV("pmiRate"));
  const [extraPayment,   setExtraPayment]  = useState(() => initV("extraPayment"));
  const [sqft,           setSqft]          = useState(() => initV("sqft"));
  const [homeAgeRange,   setHomeAgeRange]  = useState(() => initV("homeAgeRange"));
  const [pricingMode,    setPricingMode]   = useState(() => initV("pricingMode"));
  const [loanStartMonth, setLoanStartMonth]= useState(() => initV("loanStartMonth"));
  const [loanStartYear,  setLoanStartYear] = useState(() => initV("loanStartYear"));
  const [refiEnabled,    setRefiEnabled]   = useState(() => initV("refiEnabled"));
  const [refiMonth,      setRefiMonth]     = useState(() => initV("refiMonth"));
  const [refiYear,       setRefiYear]      = useState(() => initV("refiYear"));
  const [refiRate,       setRefiRate]      = useState(() => initV("refiRate"));
  const [refiTermYears,  setRefiTermYears] = useState(() => initV("refiTermYears"));
  const [manualRecasts, setManualRecasts] = useState([{ id: 1, enabled: false, month: new Date().getMonth() + 1, year: new Date().getFullYear() + 5, lump: 25000 }]);
  const [resaleMonth,    setResaleMonth]   = useState(() => initV("resaleMonth"));
  const [resaleYear,     setResaleYear]    = useState(() => initV("resaleYear"));

  // Persist
  const allState = { tab, purchaseMode, hasCurrentHome, homePrice, downPct, downDollars, downMode, rate, term, includeEscrow, taxRate, insurance, insuranceManual, newHomeState, newHomeCounty, newHomeSqft, saleState, saleCounty, saleHomeSqft, affordMode, applyProceedsToDown, additionalDownDollars, currentPayment, currentUtilities, overlapMonths, salePrice, currentBalance, closingCostsPct, listingAgentPct, buyerAgentPct, buyerConcessions, recastEnabled, proceedsApplyPct, pmiRate, extraPayment, sqft, homeAgeRange, pricingMode, loanStartMonth, loanStartYear, refiEnabled, refiMonth, refiYear, refiRate, refiTermYears, resaleMonth, resaleYear };
  useEffect(() => { lsSet(STORAGE_KEY, allState); });

  // Mode flags — needed by memos below
  const isFirstHome = purchaseMode === "firsthome";
  const isSellFirst = purchaseMode === "sellfirst";
  const isBuyFirst  = purchaseMode === "buyfirst";

  // DTI-based rate adjustment (applied on top of credit+term lookup)
  const dtiAdjustment = useMemo(() => {
    const income = profile.grossMonthlyIncome || 0;
    const debts  = profile.monthlyDebts || 0;
    if (!income) return { adj: 0, dti: null, label: "Set income in Profile" };
    const rawDTI = debts / income;
    let adj = 0, label = "";
    if (rawDTI <= 0.20)      { adj = -0.125; label = "Excellent DTI — slight rate benefit"; }
    else if (rawDTI <= 0.36) { adj =  0;     label = "Good DTI — no adjustment"; }
    else if (rawDTI <= 0.43) { adj =  0.125; label = "Moderate DTI — minor rate bump"; }
    else if (rawDTI <= 0.50) { adj =  0.375; label = "High DTI — fewer lenders qualify you"; }
    else                      { adj =  0.625; label = "DTI over 50% — qualification risk"; }
    return { adj, dti: rawDTI, label };
  }, [profile.grossMonthlyIncome, profile.monthlyDebts]);

  // Term spreads (fallback when table not loaded)
  const TERM_SPREAD = { 10: -0.45, 15: -0.60, 20: -0.25, 25: -0.10, 30: 0, 40: 0.30 };

  const getAdjustedRate = (baseTerm = 30) => {
    const creditTier = profile.creditRange || "740-759";
    const key = baseTerm + "_" + creditTier;
    // Base: lookup table or fallback
    let base;
    if (rateTable[key]) base = rateTable[key];
    else {
      const creditAdj = CREDIT_ADJ[creditTier] ?? 0.25;
      base = liveRate.rate30 + (TERM_SPREAD[baseTerm] ?? 0) + creditAdj;
    }
    // Add DTI adjustment on top
    return +(base + dtiAdjustment.adj).toFixed(2);
  };
  const taxLookup   = useMemo(() => newHomeCounty ? lookupTaxRate(newHomeState, newHomeCounty) : null, [newHomeState, newHomeCounty]);
  const newHomePpsf = useMemo(() => newHomeCounty ? lookupPpsf(newHomeState,    newHomeCounty) : null, [newHomeState, newHomeCounty]);
  const salePpsf    = useMemo(() => saleCounty    ? lookupPpsf(saleState,       saleCounty)    : null, [saleState,    saleCounty]);

  useEffect(() => { if (taxLookup) setTaxRate(taxLookup.rate); }, [taxLookup]);

  // Insurance auto
  const countyMonthlyInsurance = useMemo(() => Math.round((homePrice * 1.35) / 100 / 12), [homePrice]);
  useEffect(() => { if (!insuranceManual) setInsurance(countyMonthlyInsurance); }, [countyMonthlyInsurance, insuranceManual]);
  const handleInsuranceChange = v => { setInsurance(v); setInsuranceManual(true); };
  const resetInsurance = () => { setInsurance(countyMonthlyInsurance); setInsuranceManual(false); };

  // Core calc
  const calc = useMemo(() => {
    const down = downMode === "dollar" ? Math.min(downDollars, homePrice) : homePrice * (downPct / 100);
    const effDownPct = (down / homePrice) * 100;
    const principal  = homePrice - down;
    const newPI      = calcPI(principal, rate, term * 12);
    const monthlyTax = (homePrice * (taxRate / 100)) / 12;
    const needsPMI   = effDownPct < 20;
    const monthlyPMI = needsPMI ? (principal * (pmiRate / 100)) / 12 : 0;
    const newTotal   = newPI + (includeEscrow ? monthlyTax + insurance : 0) + monthlyPMI;
    const combinedMonthly = newTotal + currentPayment + currentUtilities;
    const totalBridgeCost = combinedMonthly * overlapMonths;
    const closingCostsDollar    = salePrice * closingCostsPct / 100;
    const listingAgentDollar    = salePrice * listingAgentPct / 100;
    const buyerAgentDollar      = salePrice * buyerAgentPct  / 100;
    const buyerConcessionDollar = salePrice * buyerConcessions / 100;
    const totalSellingCosts = closingCostsDollar + listingAgentDollar + buyerAgentDollar + buyerConcessionDollar;
    const totalSellingPct   = closingCostsPct + listingAgentPct + buyerAgentPct + buyerConcessions;
    const netProceeds = Math.max(0, salePrice - totalSellingCosts - currentBalance);
    const proceedsApplied = recastEnabled ? netProceeds * (proceedsApplyPct / 100) : 0;
    const proceedsKept    = netProceeds - proceedsApplied;
    const mr = rate / 100 / 12, n = term * 12;
    const balAfterOverlap = (() => { let b = principal, pi = newPI; for (let m = 0; m < Math.min(overlapMonths, n) && b > 0.01; m++) { const ic = b * mr; b = Math.max(0, b - Math.min(b, pi - ic)); } return b; })();
    const recastPrincipal = recastEnabled ? Math.max(0, balAfterOverlap - proceedsApplied) : balAfterOverlap;
    const remainingTermMonths = n - overlapMonths;
    const recastPI    = recastEnabled && recastPrincipal > 0 && remainingTermMonths > 0 ? calcPI(recastPrincipal, rate, remainingTermMonths) : newPI;
    const recastTotal = recastEnabled ? recastPI + (includeEscrow ? monthlyTax + insurance : 0) : newTotal;
    const monthlySavings = newTotal - recastTotal;
    const refiPI    = calcPI(recastPrincipal, refiRate, refiTermYears * 12);
    const refiTotal = refiPI + (includeEscrow ? monthlyTax + insurance : 0);
    const refiClosingCost = recastPrincipal * 0.025;
    const refiSavings   = newTotal - refiTotal;
    const recastSavings = newTotal - recastTotal;
    const breakEvenMonths = refiSavings > recastSavings ? Math.round(refiClosingCost / Math.max(0.01, refiSavings - recastSavings)) : null;
    return { down, effDownPct, principal, newPI, monthlyTax, monthlyPMI, needsPMI, newTotal, combinedMonthly, totalBridgeCost, closingCostsDollar, listingAgentDollar, buyerAgentDollar, buyerConcessionDollar, totalSellingCosts, totalSellingPct, netProceeds, proceedsApplied, proceedsKept, balAfterOverlap, recastPrincipal, recastPI, recastTotal, monthlySavings, remainingTermMonths, refiPI, refiTotal, breakEvenMonths };
  }, [homePrice, downPct, downDollars, downMode, rate, term, includeEscrow, taxRate, insurance, currentPayment, currentUtilities, overlapMonths, salePrice, currentBalance, closingCostsPct, listingAgentPct, buyerAgentPct, buyerConcessions, recastEnabled, proceedsApplyPct, pmiRate, refiRate, refiTermYears]);

  // Affordability calc
  const affordCalc = useMemo(() => {
    if (!affordMode) return null;
    const maxPay = profile.maxMonthly || 2000;
    const taxRateEst   = (includeEscrow && taxLookup) ? taxLookup.rate / 100 : 0;
    const insurRateEst = includeEscrow ? 0.0135 : 0;
    const mr2 = rate / 100 / 12, n2 = term * 12;
    let estPrice = 300000;
    for (let i = 0; i < 4; i++) {
      const escrowEst = estPrice * (taxRateEst + insurRateEst) / 12;
      const piPay     = Math.max(0, maxPay - escrowEst);
      const maxP      = mr2 === 0 ? piPay * n2 : piPay * ((Math.pow(1 + mr2, n2) - 1) / (mr2 * Math.pow(1 + mr2, n2)));
      const down      = downMode === "dollar" ? downDollars : estPrice * (downPct / 100);
      estPrice = maxP + down;
    }
    const escrowEst = estPrice * (taxRateEst + insurRateEst) / 12;
    const piPayment = Math.max(0, maxPay - escrowEst);
    return { estPrice: Math.round(estPrice / 1000) * 1000, escrowEst, piPayment };
  }, [affordMode, profile.maxMonthly, includeEscrow, taxLookup, rate, term, downMode, downDollars, downPct]);

  useEffect(() => {
    if (affordCalc && Math.abs(affordCalc.estPrice - homePrice) > 500) setHomePrice(affordCalc.estPrice);
  }, [affordCalc]);

  // Effective down (Sell First + proceeds)
  const effectiveDownDollars = useMemo(() => {
    if (isSellFirst && applyProceedsToDown && calc.netProceeds > 0) return calc.netProceeds + additionalDownDollars;
    return downMode === "dollar" ? downDollars : homePrice * (downPct / 100);
  }, [isSellFirst, applyProceedsToDown, calc.netProceeds, additionalDownDollars, downMode, downDollars, homePrice, downPct]);

  useEffect(() => {
    if (isSellFirst && applyProceedsToDown && calc.netProceeds > 0) { setDownDollars(Math.round(effectiveDownDollars)); setDownMode("dollar"); }
  }, [isSellFirst, applyProceedsToDown, effectiveDownDollars]);

  // Resale calc
  const AGE_RANGES = [
    { id: "0-5",   label: "0-5 yrs",   sub: "Near new",    mult: 1.08 },
    { id: "5-10",  label: "5-10 yrs",  sub: "Modern",      mult: 1.04 },
    { id: "10-15", label: "10-15 yrs", sub: "Established", mult: 1.00 },
    { id: "15-20", label: "15-20 yrs", sub: "Some aging",  mult: 0.94 },
    { id: "20+",   label: "20+ yrs",   sub: "Older",       mult: 0.86 },
  ];
  const ageMult = (AGE_RANGES.find(a => a.id === homeAgeRange) || { mult: 1.0 }).mult;

  const totalMonthsOwned = useMemo(() => {
    const s = new Date(loanStartYear, loanStartMonth - 1, 1);
    const e = new Date(resaleYear,    resaleMonth - 1,    1);
    return Math.max(0, (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth());
  }, [loanStartYear, loanStartMonth, resaleYear, resaleMonth]);

  const resaleCalc = useMemo(() => {
    const basePpsfRaw = newHomePpsf ? newHomePpsf.price : 142;
    const basePpsf = basePpsfRaw * ageMult;
    const yearsToSale = totalMonthsOwned / 12;
    const projectedPpsf = basePpsf * Math.pow(1.025, yearsToSale);
    const activePpsf = pricingMode === "projected" ? projectedPpsf : basePpsf;
    const projectedPrice = newHomeSqft * activePpsf;
    const mr = rate / 100 / 12;
    let bal = calc.principal, cPI = calc.newPI, rcD = false, rfD = false, cMR = mr;
    for (let m = 0; m < Math.min(totalMonthsOwned, term * 12 + (refiEnabled ? refiTermYears * 12 : 0)) && bal > 0.01; m++) {
      if (!rcD && m === overlapMonths) { bal = Math.max(0, bal - calc.proceedsApplied); cPI = calc.recastPI > 0 ? calc.recastPI : cPI; rcD = true; }
      if (refiEnabled && !rfD) {
        const s2 = new Date(loanStartYear, loanStartMonth - 1, 1), r2 = new Date(refiYear, refiMonth - 1, 1);
        const ri = Math.max(1, (r2.getFullYear() - s2.getFullYear()) * 12 + r2.getMonth() - s2.getMonth());
        if (m === ri) { cMR = refiRate / 100 / 12; const n2 = refiTermYears * 12; cPI = cMR === 0 ? bal / n2 : (bal * cMR * Math.pow(1 + cMR, n2)) / (Math.pow(1 + cMR, n2) - 1); rfD = true; }
      }
      const ic = bal * cMR; bal = Math.max(0, bal - Math.min(bal, cPI - ic + extraPayment));
    }
    const balanceAtSale = bal;
    const totalSellPct = closingCostsPct + listingAgentPct + buyerAgentPct + buyerConcessions;
    const sellingCostsDollar = projectedPrice * totalSellPct / 100;
    const netResaleProceeds  = Math.max(0, projectedPrice - sellingCostsDollar - balanceAtSale);
    const equityGain = projectedPrice - homePrice;
    return { projectedPrice, balanceAtSale, sellingCostsDollar, netResaleProceeds, equityGain, yrs: Math.floor(totalMonthsOwned / 12), mos: totalMonthsOwned % 12, activePpsf: Math.round(activePpsf), projectedPpsf: Math.round(projectedPpsf), basePpsf: Math.round(basePpsf), totalSellPct };
  }, [newHomeSqft, newHomePpsf, ageMult, pricingMode, totalMonthsOwned, rate, calc, overlapMonths, refiEnabled, refiRate, refiTermYears, loanStartYear, loanStartMonth, refiYear, refiMonth, extraPayment, term, homePrice, closingCostsPct, listingAgentPct, buyerAgentPct, buyerConcessions]);

  // Scenario save
  const saveScenario = () => {
    // Pre-fill name from profile if available
    const defaultName = profile.firstName
      ? profile.firstName + (profile.lastName ? " " + profile.lastName[0] + "." : "") + " — " + new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setScenarioName(defaultName);
    setShowSaveModal(true);
  };
  const confirmSave = () => {
    if (!scenarioName.trim()) return;
    const snap = { name: scenarioName.trim(), homePrice, downPct, rate, term, purchaseMode, calcSnapshot: { newTotal: calc.newTotal, recastTotal: calc.recastTotal, netProceeds: calc.netProceeds }, ts: Date.now() };
    const next = [...scenarios.slice(-9), snap];
    setScenarios(next);
    lsSet(SCENARIOS_KEY, next);
    setShowSaveModal(false);
    setScenarioName("");
  };
  const deleteScenario = i => { const next = scenarios.filter((_, idx) => idx !== i); setScenarios(next); lsSet(SCENARIOS_KEY, next); };

  const loadScenario = s => {
    if (s.homePrice)    setHomePrice(s.homePrice);
    if (s.downPct)      setDownPct(s.downPct);
    if (s.downDollars)  setDownDollars(s.downDollars);
    if (s.downMode)     setDownMode(s.downMode);
    if (s.rate)         setRate(s.rate);
    if (s.term)         setTerm(s.term);
    if (s.purchaseMode) {
      setPurchaseMode(s.purchaseMode);
      setHasCurrentHome(s.purchaseMode !== "firsthome");
    }
    setViewingScenario(null);
    setShowScenarios(false);
    setTab("new");
  };

  const showOverlap = isBuyFirst && hasCurrentHome;
  const showSale    = (isSellFirst || isBuyFirst) && hasCurrentHome;
  const monthlyEscrow = includeEscrow ? calc.monthlyTax + insurance : 0;
  const ownedLabel = resaleCalc.yrs > 0 || resaleCalc.mos > 0 ? ((resaleCalc.yrs > 0 ? resaleCalc.yrs + "yr " : "") + (resaleCalc.mos > 0 ? resaleCalc.mos + "mo" : "")).trim() : "0mo";

  const TABS = isSellFirst
    ? [{ id: "recast", label: "Sell" }, { id: "new", label: "New Home" }, { id: "amort", label: "Amort." }, { id: "resale", label: "Resale" }, { id: "summary", label: "Summary" }]
    : [{ id: "new", label: "New Home" }, ...(showOverlap ? [{ id: "bridge", label: "Overlap" }] : []), ...(showSale ? [{ id: "recast", label: "Sell" }] : []), { id: "amort", label: "Amort." }, { id: "resale", label: "Resale" }, { id: "summary", label: "Summary" }];

  const tabIds   = TABS.map(t => t.id);
  const tabIndex = tabIds.indexOf(tab);
  const prevTab  = tabIndex > 0               ? tabIds[tabIndex - 1] : null;
  const nextTab  = tabIndex < tabIds.length - 1 ? tabIds[tabIndex + 1] : null;



  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "flex-start", justifyContent: "center", width: "100%", overflowX: "hidden", fontFamily: SF }}>
      <div style={{ width: "100%", maxWidth: "480px", minWidth: 0, paddingBottom: "90px" }}>

        {/* Modals */}
        {showSettings && <SettingsScreen onClose={() => setShowSettings(false)} profile={profile} setProfile={setProfile} liveRate={liveRate} />}

        {/* Help drawer — pull tab on right edge */}
        <HelpDrawer tab={tab} />
        {showCompare  && <ScenarioCompare scenarios={scenarios} onClose={() => setShowCompare(false)} />}
        {viewingScenario && (
          <ScenarioViewer
            scenario={viewingScenario}
            onClose={() => setViewingScenario(null)}
            onUpdate={s => loadScenario(s)}
          />
        )}

        {/* Save scenario modal */}
        {showSaveModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(26,14,46,0.65)", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div style={{ background: C.bg, borderRadius: "20px", width: "100%", maxWidth: "380px", padding: "24px 20px", boxShadow: "0 20px 60px rgba(26,14,46,0.3)" }}>
              <div style={{ fontSize: "17px", fontWeight: 800, color: C.text, fontFamily: SF, marginBottom: "4px" }}>Save Scenario</div>
              <div style={{ fontSize: "13px", color: C.dim, fontFamily: SF, marginBottom: "17px" }}>Give this scenario a name to find it later</div>
              <input
                value={scenarioName}
                onChange={e => setScenarioName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") confirmSave(); if (e.key === "Escape") setShowSaveModal(false); }}
                autoFocus
                placeholder="e.g. 20% down, 30yr..."
                style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: `1.5px solid ${C.blue}`, fontFamily: SF, fontSize: "16px", background: C.blueBg, color: C.text, outline: "none", marginBottom: "14px", boxSizing: "border-box" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setShowSaveModal(false)} style={{ flex: 1, padding: "13px", background: "transparent", color: C.dim, border: "none", borderRadius: "10px", fontSize: "14px", fontFamily: SF, cursor: "pointer" }}>Cancel</button>
                <button onClick={confirmSave} disabled={!scenarioName.trim()} style={{ flex: 2, padding: "13px", background: scenarioName.trim() ? `linear-gradient(135deg,${C.blue},#8b1a8f)` : C.track, color: scenarioName.trim() ? "#fff" : C.dim, border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 800, fontFamily: SF, cursor: scenarioName.trim() ? "pointer" : "default" }}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Affordability modal */}
        {showAffordModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(26,14,46,0.65)", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div style={{ background: C.bg, borderRadius: "20px", width: "100%", maxWidth: "400px", padding: "24px 20px", boxShadow: "0 20px 60px rgba(26,14,46,0.3)" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: C.text, fontFamily: SF, marginBottom: "8px" }}>Need your sale info first</div>
              <div style={{ fontSize: "13px", color: C.mid, fontFamily: SF, lineHeight: 1.6, marginBottom: "20px" }}>To calculate what you can afford, we need your expected sale price and how much of the proceeds you want to apply.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button onClick={() => { setShowAffordModal(false); setTab("recast"); }} style={{ padding: "14px", background: `linear-gradient(135deg,${C.blue},#8b1a8f)`, color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 800, fontFamily: SF, cursor: "pointer" }}>Fill Out Sale Info</button>
                <button onClick={() => { setShowAffordModal(false); setAffordMode(false); }} style={{ padding: "13px", background: "transparent", color: C.dim, border: "none", borderRadius: "12px", fontSize: "14px", fontFamily: SF, cursor: "pointer" }}>Turn off Affordability Mode</button>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios sheet */}
        {showScenarios && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(26,14,46,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowScenarios(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background: C.bg, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: "480px", padding: "24px 20px 48px", maxHeight: "80vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "17px", fontWeight: 800, color: C.text, fontFamily: SF }}>Saved Scenarios</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {scenarios.length >= 2 && (
                    <button onClick={() => { setShowScenarios(false); setShowCompare(true); }} style={{ padding: "11px 20px", borderRadius: "8px", background: C.blueBg, color: C.blue, border: "none", fontSize: "13px", fontWeight: 700, fontFamily: SF, cursor: "pointer" }}>Compare</button>
                  )}
                  <button onClick={() => setShowScenarios(false)} style={{ background: "none", border: "none", fontSize: "20px", color: C.dim, cursor: "pointer" }}>x</button>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, marginBottom: "14px" }}>
                Tap any scenario to view · Compare up to 3 · Saved on this device only
              </div>
              {scenarios.length === 0
                ? <Card><div style={{ textAlign: "center", padding: "1.5rem 0", color: C.dim, fontFamily: SF, fontSize: "14px" }}>No saved scenarios yet. Tap Save on the Summary tab.</div></Card>
                : scenarios.map((s, i) => (
                  <button key={i} onClick={() => { setShowScenarios(false); setViewingScenario(s); }} style={{ width: "100%", background: C.card, border: "none", borderRadius: "13px", marginBottom: "8px", padding: "0.85rem 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0, padding: "4px 0" }}>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: C.text, fontFamily: SF, marginBottom: "3px" }}>{s.name}</div>
                      <div style={{ fontSize: "13px", color: C.mid, fontFamily: SF }}>{fmt(s.homePrice)} · {s.downPct}% dn · {s.rate}% · {s.term}yr</div>
                      {s.calcSnapshot && (
                        <div style={{ fontSize: "13px", color: C.blue, fontFamily: SF, marginTop: "2px" }}>
                          {fmtFull(s.calcSnapshot.newTotal)}/mo → {fmtFull(s.calcSnapshot.recastTotal)}/mo after recast
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0, marginLeft: "8px" }}>
                      <div style={{ fontSize: "12px", color: C.blue, fontFamily: SF }}>View →</div>
                      <button onClick={e => { e.stopPropagation(); deleteScenario(i); }} style={{ background: "none", border: "none", color: C.dim, fontSize: "13px", cursor: "pointer", padding: "2px 4px", fontFamily: SF }}>Delete</button>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* iOS Large Title Navigation Bar */}
        <div style={{ background: "linear-gradient(160deg,#c0166a 0%,#8b1a8f 55%,#0b5f8f 100%)", paddingTop: "env(safe-area-inset-top,44px)", marginBottom: "8px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 0%,rgba(255,255,255,0.10) 0%,transparent 70%)", pointerEvents: "none" }} />

          {/* Nav bar row */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "12px 16px 0", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {/* Floppy disk — saved scenarios */}
              <button onClick={() => setShowScenarios(true)} style={{ width: "34px", height: "34px", borderRadius: "17px", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
              </button>
              <button onClick={() => setShowSettings(true)} style={{ width: "34px", height: "34px", borderRadius: "17px", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Logo + Greeting */}
          <div style={{ padding: "5px 16px 16px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img
              src="data:image/png;base64,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l1566Zlr1659qrGxcUC2orq6urbnnnvu7jRTcdAWkPeuRUVFp23atCl17xtuuOGWXsZAAMDnPve5STt27NibtqEPffnLX57LzGIocbNpiSpbvHs+8sgjS0ZKQKff5zvf+c4Nq1at2pVMJgck8Nm3b5/9zDPPPPLRj360rJeDut/xvPHGGy9wMwSZmfnxxx//74H64x6CYuLEiWPfeuutSGfK9FOrZ82a5RtMCri3nr797W9f884772zsTsDVO1PgYf3aa68988lPfnJGpv3tLqD/+c9/7h0KS+Edd9zx/EjO9/9r7f/qoLBt20REyrbtpRs2bJjX1taGSCSyGwA2btzIaVgZd8dKtdbxdevWPdne3u5rampCPB5vAIBZs2YN2oyprKxULjzx+jPPPHP5fffdd97xxx9/U1ZW1kVjxozxB4NBTUTc1NQk6urq6hoaGp568803f3X33XdvHAp/bxpuqQEgEAhs37Vr1yO2befG43ERjUa39TIG+oYb7jeXLv3iHr/f/9XPfe5zXySiRG5ubm5ZWdmlRLR+ONlqO3fufLG4uHgnM6O5uXkT0BnpMtzmkl1JIlr6k5/85LEf/ehHXz3llFOuHTVq1PElJSXs9/uhlKLGxkbU19dHACz917/+9Y9f/epXb3jCKhOuZi/+vLi4eO6+ffue3b59O1paWqLf+973HgRA/UUrhEIhvWTJErF3795DTzzxxLellJcRke33+805c+aUEdHuTImU3KQUSUSP3XXXXc/eeeedX5o/f/7HR40aNb+4uBh5eXlaa83Nzc2iubn5UHt7+5Mvv/zyY3fdddcrg+lvd3js0KFDz69fv368ZVkaAGmH2KbLvnExcAAEIYQKBPySmZeP5Hz/v9b+fw1GeFpFvX1JAAAAAElFTkSuQmCC"
              alt="DOMAVi Mortgage"
              style={{
                display: "block",
                width: "100%",
                maxWidth: "360px",
                marginBottom: "4px",
              }}
            />
            {profile.firstName && (
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.72)", fontFamily: SF, letterSpacing: "0.01em" }}>
                {"Hello, " + profile.firstName + " 👋"}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "0 16px" }}>

          {/* Two-toggle mode selector */}
          <Card style={{ marginBottom: "10px" }}>
            {(() => {
              const isAgent = profile.buyerType === "agent";
              const they = isAgent ? "Client has" : "I have";
              const theyll = isAgent ? "Client will sell" : "I'll sell";
              const sellSub = isAgent ? "Client sells first, then buys" : "Sell first, then buy";
              const buySub  = isAgent ? "Client buys first, then sells" : "Buy first, then sell";
              const noHomeSub = isAgent ? "Client has no home to sell" : "First-time or no home to sell";
              const hasHomeSub = isAgent ? "Client is selling an existing home" : "Selling an existing home";
              return <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "52px", padding: "14px 20px" }}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: C.text, fontFamily: SF }}>{they} a home to sell</div>
                    <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, marginTop: "2px" }}>
                      {hasCurrentHome ? hasHomeSub : noHomeSub}
                    </div>
                  </div>
                  <Toggle
                    checked={hasCurrentHome}
                    onChange={v => {
                      setHasCurrentHome(v);
                      if (!v) { setPurchaseMode("firsthome"); setTab("new"); }
                      else    { setPurchaseMode("buyfirst");  setTab("new"); }
                    }}
                  />
                </div>
                {hasCurrentHome && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "52px", padding: "14px 20px", borderTop: "0.5px solid rgba(60,0,80,0.10)" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: C.text, fontFamily: SF }}>{theyll} before buying</div>
                      <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, marginTop: "2px" }}>
                        {isSellFirst ? sellSub : buySub}
                      </div>
                    </div>
                    <Toggle
                      checked={isSellFirst}
                      onChange={v => {
                        setPurchaseMode(v ? "sellfirst" : "buyfirst");
                        setTab(v ? "recast" : "new");
                      }}
                    />
                  </div>
                )}
              </>;
            })()}
          </Card>

          {/* Live rate banner — adjusted for credit score + loan term */}
          {(() => {
            const creditAdj = CREDIT_ADJ[profile.creditRange] ?? 0.25;
            const termAdj   = TERM_SPREAD[term] ?? 0;
            const adjRate   = getAdjustedRate(term);
            const hasCredit = profile.creditRange;
            const totalAdj  = +(creditAdj + termAdj).toFixed(3);
            return (
              <div style={{ background: C.pill, border: "none", borderRadius: "10px", padding: "11px 16px", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "12px", color: C.pillText, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {hasCredit ? term + "yr · " + (profile.creditRange || "") + " credit" : term + "yr market avg"}
                    {liveRate.fetched ? " · " + (liveRate.sources || "20") + " sources" : " · loading..."}
                  </div>
                  {dtiAdjustment.dti !== null && (
                    <div style={{ fontSize: "11px", color: C.dim, fontFamily: SF, marginTop: "2px" }}>
                      DTI {Math.round(dtiAdjustment.dti * 100)}% — {dtiAdjustment.label}
                    </div>
                  )}
                  {!profile.grossMonthlyIncome && (
                    <div style={{ fontSize: "11px", color: C.amber, fontFamily: SF, marginTop: "2px" }}>
                      Add income in Profile for DTI-adjusted rate
                    </div>
                  )}
                  <div style={{ fontSize: "14px", fontWeight: 700, color: C.pillAccent, fontFamily: SF }}>{adjRate}%</div>
                  {(totalAdj !== 0 || dtiAdjustment.adj !== 0) && (
                    <div style={{ fontSize: "11px", color: C.dim, fontFamily: SF }}>
                      Base {rateTable[term + "_760+"] || liveRate.rate30}%
                      {creditAdj > 0 ? " + " + creditAdj + "% credit" : ""}
                      {dtiAdjustment.adj > 0 ? " + " + dtiAdjustment.adj + "% DTI" : ""}
                      {dtiAdjustment.adj < 0 ? " " + dtiAdjustment.adj + "% DTI" : ""}
                    </div>
                  )}
                </div>
                <button onClick={() => setRate(adjRate)} style={{ padding: "5px 11px", borderRadius: "7px", background: C.blue, color: "#fff", border: "none", fontSize: "12px", fontWeight: 700, fontFamily: SF, cursor: "pointer" }}>Use</button>
              </div>
            );
          })()}

          {/* Hero — mode aware */}
          <div style={{ background: `linear-gradient(135deg,#c0166a 0%,#8b1a8f 50%,#0b5f8f 100%)`, borderRadius: "16px", padding: "18px", marginBottom: "14px", boxShadow: "0 4px 20px rgba(192,22,106,0.2)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />

            {/* First Home — just the mortgage payment */}
            {isFirstHome && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", textAlign: "center" }}>
                {[
                  { label: "Monthly Payment",   val: fmtFull(calc.newTotal),  sub: "P+I" + (includeEscrow ? " + escrow" : "") + (calc.needsPMI ? " + PMI" : "") },
                  { label: "Loan Amount",        val: fmt(calc.principal),     sub: (calc.effDownPct).toFixed(1) + "% down" },
                ].map(({ label, val, sub }, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.13)", borderRadius: "10px", padding: "14px 10px" }}>
                    <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: SF, marginBottom: "3px" }}>{label}</div>
                    <div style={{ fontSize: "clamp(0.85rem,3.8vw,1.1rem)", fontWeight: 800, color: "#fff", fontFamily: SF, lineHeight: 1.1 }}>{val}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: SF, marginTop: "2px" }}>{sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Sell First — mortgage + proceeds */}
            {isSellFirst && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", textAlign: "center" }}>
                {[
                  { label: "New Mortgage",   val: fmtFull(calc.newTotal),    sub: "/ month" },
                  { label: "Net Proceeds",   val: fmt(calc.netProceeds),      sub: "from sale" },
                ].map(({ label, val, sub }, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.13)", borderRadius: "10px", padding: "14px 10px" }}>
                    <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: SF, marginBottom: "3px" }}>{label}</div>
                    <div style={{ fontSize: "clamp(0.85rem,3.8vw,1.1rem)", fontWeight: 800, color: "#fff", fontFamily: SF, lineHeight: 1.1 }}>{val}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: SF, marginTop: "2px" }}>{sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Buy First — full picture: new mortgage, overlap, after recast */}
            {isBuyFirst && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", textAlign: "center" }}>
                {[
                  { label: "New Mortgage",              val: fmtFull(calc.newTotal),         sub: "/ month" },
                  { label: "Overlap " + overlapMonths + "mo", val: fmtFull(calc.combinedMonthly), sub: "/ month" },
                  { label: "After Recast",               val: fmtFull(calc.recastTotal),      sub: "/ month" },
                ].map(({ label, val, sub }, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.13)", borderRadius: "10px", padding: "14px 10px" }}>
                    <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: SF, marginBottom: "3px" }}>{label}</div>
                    <div style={{ fontSize: "clamp(0.78rem,3.5vw,1rem)", fontWeight: 800, color: "#fff", fontFamily: SF, lineHeight: 1.1 }}>{val}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: SF, marginTop: "2px" }}>{sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer row — mode specific */}
            <div style={{ marginTop: "14px", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.18)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {isFirstHome && <>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontFamily: SF }}>Home price</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#fff", fontFamily: SF }}>{fmt(homePrice)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontFamily: SF }}>Rate</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#fff", fontFamily: SF }}>{rate.toFixed(2)}% · {term}yr</div>
                </div>
              </>}
              {isSellFirst && <>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontFamily: SF }}>Home price</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#fff", fontFamily: SF }}>{fmt(homePrice)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontFamily: SF }}>Rate</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#fff", fontFamily: SF }}>{rate.toFixed(2)}% · {term}yr</div>
                </div>
              </>}
              {isBuyFirst && <>
                <div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontFamily: SF }}>Total overlap cost</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: "#fff", fontFamily: SF }}>{fmt(calc.totalBridgeCost)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontFamily: SF }}>Savings post-recast</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: calc.monthlySavings > 0 ? "#6ee7b7" : "#fca5a5", fontFamily: SF }}>{calc.monthlySavings > 0 ? "-" : "+"}{fmtFull(Math.abs(calc.monthlySavings))}/mo</div>
                </div>
              </>}
            </div>
          </div>

          {/* ══ NEW HOME ══════════════════════════════════════════════════════ */}
          {tab === "new" && (
            <div style={{ animation: "fadeIn 0.18s ease" }}>

              {/* New home location */}
              <Card>
                <SectionLabel>New Home Location</SectionLabel>
                <CountyInput stateVal={newHomeState} setStateVal={setNewHomeState} countyVal={newHomeCounty} setCountyVal={setNewHomeCounty} lookup={taxLookup || newHomePpsf ? { name: (taxLookup || newHomePpsf).name, rate: taxLookup ? taxLookup.rate : null, price: newHomePpsf ? newHomePpsf.price : null } : null} />
              </Card>

              {/* Affordability toggle */}
              <Card style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px" }}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: C.text, fontFamily: SF }}>Affordability Mode</div>
                    <div style={{ fontSize: "13px", color: C.dim, fontFamily: SF, marginTop: "3px" }}>{affordMode ? "Max payment — home price calculated live" : "Enter home price manually"}</div>
                  </div>
                  <Toggle label={affordMode ? "On" : "Off"} checked={affordMode} onChange={v => { setAffordMode(v); if (v && isBuyFirst && hasCurrentHome) setShowAffordModal(true); }} />
                </div>
              </Card>

              {/* Sell First proceeds banner */}
              {isSellFirst && applyProceedsToDown && calc.netProceeds > 0 && (
                <div style={{ background: C.greenBg, border: "none", borderRadius: "10px", padding: "0.65rem 14px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "12px", color: C.green, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.08em" }}>Proceeds applied as down payment</div>
                  <div style={{ fontSize: "17px", fontWeight: 800, color: C.green, fontFamily: SF }}>{fmt(calc.netProceeds)}{additionalDownDollars > 0 ? " + " + fmt(additionalDownDollars) + " = " + fmt(effectiveDownDollars) + " total" : ""}</div>
                </div>
              )}

              <Card>
                <SectionLabel>New Home</SectionLabel>
                {affordMode ? (
                  affordCalc && (
                    <>
                      <Field label="Max monthly payment (all-in)" value={profile.maxMonthly || 2000} min={500} max={15000} step={50} onChange={v => setProfile(p => ({ ...p, maxMonthly: v }))} display={v => fmtFull(v)} parse={parseDollar} prefix="$" inputMode="numeric" />
                      <div style={{ background: C.greenBg, border: "none", borderRadius: "10px", padding: "0.65rem 14px", marginBottom: "17px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "12px", color: C.green, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.08em" }}>Calculated home price</div>
                          <div style={{ fontSize: "20px", fontWeight: 800, color: C.green, fontFamily: SF }}>{fmt(affordCalc.estPrice)}</div>
                          <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF }}>P+I: {fmtFull(affordCalc.piPayment)}/mo{includeEscrow ? " + escrow: " + fmtFull(affordCalc.escrowEst) + "/mo" : ""}</div>
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <Field label="Home Price" value={homePrice} min={50000} max={3000000} step={5000} onChange={setHomePrice} display={fmt} parse={parseDollar} prefix="$" inputMode="numeric" />
                )}

                {/* Down payment */}
                <div style={{ borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.mid, fontFamily: SF }}>Down Payment</span>
                    <div style={{ display: "flex", background: "rgba(120,80,160,0.10)", borderRadius: "8px", padding: "2px" }}>
                      {["pct", "dollar"].map(m => (
                        <button key={m} onClick={() => { setDownMode(m); if (m === "dollar") setDownDollars(Math.round(homePrice * (downPct / 100))); else setDownPct(Math.round((downDollars / homePrice) * 100 * 10) / 10); }} style={{ padding: "4px 14px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: SF, background: downMode === m ? "#fff" : "transparent", color: downMode === m ? C.blue : C.mid, boxShadow: downMode === m ? "0 1px 3px rgba(0,0,0,0.12)" : "none" }}>{m === "pct" ? "%" : "$"}</button>
                      ))}
                    </div>
                  </div>
                  {downMode === "pct"
                    ? <Field label="" value={downPct} min={0} max={80} step={0.5} onChange={setDownPct} display={v => v + "% — " + fmt(homePrice * v / 100)} parse={parseFloat} suffix="%" inputMode="decimal" />
                    : <Field label="" value={downDollars} min={0} max={homePrice} step={1000} onChange={setDownDollars} display={v => fmt(v) + " (" + ((v / homePrice) * 100).toFixed(1) + "%)"} parse={parseDollar} prefix="$" inputMode="numeric" />}
                </div>

                {calc.needsPMI && (
                  <div style={{ animation: "fadeIn 0.18s ease" }}>
                    <Field label="PMI Rate" badge="natl avg 0.85%" note="(removed at 20% equity)" value={pmiRate} min={0.1} max={2.5} step={0.05} onChange={setPmiRate} display={v => v.toFixed(2) + "%/yr"} parse={parseFloat} suffix="%/yr" inputMode="decimal" />
                  </div>
                )}

                <Field label="Interest Rate" value={rate} min={2} max={12} step={0.05} onChange={setRate} display={v => v.toFixed(2) + "%"} parse={parseFloat} suffix="%" inputMode="decimal" />

                <div style={{ borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
                  <div style={{ padding: "16px 20px 8px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.mid, fontFamily: SF }}>Loan Term</div>
                  <TermButtons value={term} onChange={setTerm} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 16px" }}>
                  <span style={{ fontSize: "15px", color: C.text, fontFamily: SF }}>Include Escrow</span>
                  <Toggle checked={includeEscrow} onChange={setIncludeEscrow} />
                </div>
              </Card>

              {/* Escrow */}
              {includeEscrow && (
                <Card style={{ animation: "fadeIn 0.2s ease" }}>
                  <SectionLabel>Escrow — Tax and Insurance</SectionLabel>
                  {taxLookup
                    ? <div style={{ fontSize: "12px", color: C.green, fontFamily: SF, marginBottom: "14px" }}>{"✓"} {taxLookup.name} — {taxLookup.rate}% · from location above</div>
                    : <div style={{ fontSize: "12px", color: C.amber, fontFamily: SF, padding: "0 20px 14px" }}>Enter county in Location above to auto-fill tax rate</div>}
                  <Field label="Property Tax Rate" badge={taxLookup ? "Tax Foundation 2024" : "manual"} value={taxRate} min={0.1} max={3.0} step={0.01} onChange={setTaxRate} display={v => v.toFixed(2) + "%"} parse={parseFloat} suffix="%" inputMode="decimal" />
                  <Field label="Home Insurance / mo" badge={insuranceManual ? "custom" : "est. 1.35%/yr"} value={insurance} min={50} max={2000} step={10} onChange={handleInsuranceChange} display={v => "$" + v + "/mo"} parse={parseDollar} prefix="$" inputMode="numeric" />
                  {insuranceManual && <button onClick={resetInsurance} style={{ fontSize: "12px", color: C.blueL, fontFamily: SF, background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: "-10px", marginBottom: "14px", display: "block" }}>{"<-"} Reset to estimate ({fmt(countyMonthlyInsurance)}/mo)</button>}
                </Card>
              )}

              {/* Market check */}
              {newHomePpsf && (
                <Card>
                  <SectionLabel>Market Price Check</SectionLabel>
                  <Field label="Square Footage" value={newHomeSqft} min={500} max={8000} step={100} onChange={setNewHomeSqft} display={v => v.toLocaleString() + " sqft"} parse={parseDollar} inputMode="numeric" />
                  {(() => {
                    const areaPpsf = newHomePpsf.price, homePpsf = Math.round(homePrice / newHomeSqft);
                    const diff = homePpsf - areaPpsf, pct = Math.round((diff / areaPpsf) * 100), absPct = Math.abs(pct);
                    let label, color;
                    if (absPct <= 5)       { label = "At market value — fair price"; color = C.green; }
                    else if (pct < -15)    { label = absPct + "% below market — great price, verify why"; color = C.amber; }
                    else if (pct < -5)     { label = absPct + "% below market — strong deal"; color = C.green; }
                    else if (pct > 15)     { label = absPct + "% above market — significantly overpriced"; color = C.red; }
                    else                   { label = absPct + "% above market — verify value before offering"; color = C.amber; }
                    return (
                      <div style={{ margin: "0 20px 20px", background: C.pill, borderRadius: "12px", padding: "14px 16px" }}>
                        <div style={{ fontSize: "14px", color: C.mid, fontFamily: SF }}>Area avg ({newHomePpsf.name}): <strong>${areaPpsf}/sqft</strong></div>
                        <div style={{ fontSize: "14px", color: C.mid, fontFamily: SF, marginTop: "4px" }}>This home: <strong>${homePpsf}/sqft</strong></div>
                        <div style={{ marginTop: "8px", fontSize: "14px", fontWeight: 700, color, fontFamily: SF }}>{label}</div>
                      </div>
                    );
                  })()}
                </Card>
              )}

              {/* New mortgage summary */}
              <Card accent={C.blue}>
                <SectionLabel>New Mortgage Payment</SectionLabel>
                <LineItem label="Loan amount" value={fmt(calc.principal)} />
                <LineItem label="Principal + interest" value={fmtFull(calc.newPI)} />
                {calc.needsPMI && <LineItem label={"PMI (" + pmiRate.toFixed(2) + "%/yr)"} value={fmtFull(calc.monthlyPMI)} color={C.amber} />}
                {includeEscrow && <><LineItem label={"Property taxes (" + taxRate.toFixed(2) + "%)"} value={fmtFull(calc.monthlyTax)} /><LineItem label="Home insurance" value={fmtFull(insurance)} /></>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: C.mid, fontFamily: SF }}>Total / month</span>
                  <span style={{ fontSize: "22px", fontWeight: 800, color: C.blue, fontFamily: SF }}>{fmtFull(calc.newTotal)}</span>
                </div>
              </Card>
            </div>
          )}

          {/* ══ OVERLAP ═══════════════════════════════════════════════════════ */}
          {tab === "bridge" && (
            <div style={{ animation: "fadeIn 0.18s ease" }}>
              <Card>
                <SectionLabel color={C.amber}>Current Mortgage</SectionLabel>
                <DollarInput label="Current monthly payment" value={currentPayment} onChange={setCurrentPayment} hint="Full payment incl. escrow" />
                <DollarInput label="Avg monthly utilities" value={currentUtilities} onChange={setCurrentUtilities} hint="Electric, gas, water, trash" />
              </Card>
              <Card>
                <SectionLabel color={C.amber}>Overlap Period</SectionLabel>
                <Field label="Months carrying both" value={overlapMonths} min={1} max={24} step={1} onChange={setOverlapMonths} display={v => v + " mo"} parse={parseInt} suffix=" mo" inputMode="numeric" />
              </Card>
              <Card accent={C.amber}>
                <SectionLabel color={C.amber}>Overlap Summary</SectionLabel>
                <LineItem label="New mortgage" value={fmtFull(calc.newTotal)} />
                <LineItem label="Current mortgage" value={fmtFull(currentPayment)} />
                <LineItem label="Utilities (current home)" value={fmtFull(currentUtilities)} color={C.amber} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 4px", borderTop: `2px solid ${C.amberBorder}` }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: C.mid, fontFamily: SF }}>Combined / month</span>
                  <span style={{ fontSize: "22px", fontWeight: 800, color: C.amber, fontFamily: SF }}>{fmtFull(calc.combinedMonthly)}</span>
                </div>
                <div style={{ marginTop: "14px", background: C.pill, border: "none", borderRadius: "10px", padding: "10px 14px" }}>
                  <div style={{ fontSize: "12px", color: C.pillText, fontFamily: SF, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2px" }}>Total overlap spend ({overlapMonths} months)</div>
                  <div style={{ fontSize: "19px", fontWeight: 800, color: C.pillAccent, fontFamily: SF }}>{fmt(calc.totalBridgeCost)}</div>
                </div>
              </Card>
            </div>
          )}

          {/* ══ SELL ══════════════════════════════════════════════════════════ */}
          {tab === "recast" && (
            <div style={{ animation: "fadeIn 0.18s ease" }}>
              <Card>
                <SectionLabel>Current Home Sale</SectionLabel>
                <DollarInput label="Expected sale price" value={salePrice} onChange={setSalePrice} hint="What you expect to sell for" />
                <DollarInput label="Remaining mortgage balance" value={currentBalance} onChange={setCurrentBalance} hint="What you still owe" />
                <CountyInput stateVal={saleState} setStateVal={setSaleState} countyVal={saleCounty} setCountyVal={setSaleCounty} lookup={salePpsf} label="Current Home County (market check)" />
                {salePpsf && (
                  <>
                    <Field label="Current Home Sqft" value={saleHomeSqft} min={300} max={8000} step={100} onChange={setSaleHomeSqft} display={v => v.toLocaleString() + " sqft"} parse={parseDollar} inputMode="numeric" />
                    {(() => {
                      const areaPpsf = salePpsf.price, homePpsf = Math.round(salePrice / saleHomeSqft);
                      const diff = homePpsf - areaPpsf, pct = Math.round((diff / areaPpsf) * 100), absPct = Math.abs(pct);
                      let label, color;
                      if (absPct <= 5)    { label = "At market value — strong position"; color = C.green; }
                      else if (pct > 15)  { label = absPct + "% above market — may sit longer, consider pricing down"; color = C.red; }
                      else if (pct > 5)   { label = absPct + "% above market — priced well, strong equity"; color = C.green; }
                      else if (pct < -15) { label = absPct + "% below market — significantly underpriced, price it up"; color = C.red; }
                      else                { label = absPct + "% below market — consider pricing higher"; color = C.amber; }
                      return (
                        <div style={{ margin: "0 20px 20px", background: C.pill, borderRadius: "12px", padding: "14px 16px" }}>
                          <div style={{ fontSize: "14px", color: C.mid, fontFamily: SF }}>Area avg ({salePpsf.name}): <strong>${areaPpsf}/sqft</strong></div>
                          <div style={{ fontSize: "14px", color: C.mid, fontFamily: SF, marginTop: "4px" }}>Your asking price: <strong>${homePpsf}/sqft</strong></div>
                          <div style={{ marginTop: "8px", fontSize: "14px", fontWeight: 700, color, fontFamily: SF }}>{label}</div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </Card>

              <Card>
                <SectionLabel color={C.red}>Selling Costs</SectionLabel>
                <Field label="Closing costs" note="(avg 3.14%)" value={closingCostsPct} min={0} max={6} step={0.1} onChange={setClosingCostsPct} display={v => v.toFixed(2) + "%"} parse={parseFloat} suffix="%" inputMode="decimal" />
                <Field label="Your listing agent" note="(avg 2.82%)" value={listingAgentPct} min={0} max={5} step={0.1} onChange={setListingAgentPct} display={v => v.toFixed(2) + "%"} parse={parseFloat} suffix="%" inputMode="decimal" />
                <Field label="Buyer's agent" value={buyerAgentPct} min={0} max={5} step={0.1} onChange={setBuyerAgentPct} display={v => v.toFixed(2) + "%"} parse={parseFloat} suffix="%" inputMode="decimal" />
                <Field label="Buyer concessions" note="(avg 2.0%)" value={buyerConcessions} min={0} max={6} step={0.25} onChange={setBuyerConcessions} display={v => v.toFixed(2) + "%"} parse={parseFloat} suffix="%" inputMode="decimal" />
                <div style={{ background: C.redBg, borderRadius: "12px", margin: "0 20px 20px", overflow: "hidden" }}>
                  {[{ l: "Closing (" + closingCostsPct.toFixed(2) + "%)", v: fmt(calc.closingCostsDollar) }, { l: "Your agent (" + listingAgentPct.toFixed(2) + "%)", v: fmt(calc.listingAgentDollar) }, { l: "Buyer agent (" + buyerAgentPct.toFixed(2) + "%)", v: fmt(calc.buyerAgentDollar) }, { l: "Concessions (" + buyerConcessions.toFixed(2) + "%)", v: fmt(calc.buyerConcessionDollar) }].map(({ l, v }) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", fontFamily: SF, color: C.mid, padding: "11px 16px", borderBottom: "0.5px solid rgba(184,8,79,0.12)" }}>
                      <span>{l}</span><span style={{ color: C.red, fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "15px", fontWeight: 700, fontFamily: SF, color: C.red, padding: "13px 16px" }}>
                    <span>Total ({calc.totalSellingPct.toFixed(2)}%)</span><span>{fmt(calc.totalSellingCosts)}</span>
                  </div>
                </div>
              </Card>

              <Card accent={C.green}>
                <SectionLabel color={C.green}>Net Proceeds</SectionLabel>
                {!isSellFirst && (
                  <div style={{ margin: "0 20px 20px", background: C.pill, borderRadius: "12px", padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: C.pillAccent, fontFamily: SF }}>Apply to Recast?</span>
                      <Toggle checked={recastEnabled} onChange={setRecastEnabled} />
                    </div>
                  </div>
                )}
                {[{ label: "Sale price", val: fmt(salePrice) }, { label: "- Selling costs", val: "- " + fmt(calc.totalSellingCosts), color: C.red }, { label: "- Mortgage payoff", val: "- " + fmt(currentBalance), color: C.red }].map(({ label, val, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "15px", fontFamily: SF, color: color || C.mid, padding: "13px 20px", borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
                    <span>{label}</span><span style={{ fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 16px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: C.mid, fontFamily: SF }}>{isSellFirst ? "Net proceeds (-> down payment)" : "Total net proceeds"}</span>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: C.green, fontFamily: SF }}>{fmt(calc.netProceeds)}</span>
                </div>

                {isSellFirst && (
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "0.5px solid rgba(60,0,80,0.10)" }}>
                      <span style={{ fontSize: "15px", color: C.text, fontFamily: SF }}>Apply proceeds to down payment?</span>
                      <Toggle checked={applyProceedsToDown} onChange={setApplyProceedsToDown} />
                    </div>
                    {applyProceedsToDown && (
                      <>
                        <div style={{ background: C.greenBg, borderRadius: "10px", margin: "0 20px 14px", padding: "14px 20px", fontSize: "13px", color: C.green, fontFamily: SF, lineHeight: 1.5 }}>{fmt(calc.netProceeds)} will be applied as your down payment on the new home.</div>
                        <Field label="Additional cash down payment" value={additionalDownDollars} min={0} max={500000} step={1000} onChange={setAdditionalDownDollars} display={v => v === 0 ? "None" : fmt(v)} parse={parseDollar} prefix="$" inputMode="numeric" />
                      </>
                    )}
                  </div>
                )}

                {!isSellFirst && recastEnabled && calc.netProceeds > 0 && (
                  <>
                    <Field label="% of proceeds to apply" value={proceedsApplyPct} min={0} max={100} step={5} onChange={setProceedsApplyPct} display={v => v + "% — " + fmt(calc.netProceeds * v / 100)} parse={parseFloat} suffix="%" inputMode="decimal" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontFamily: SF, color: C.mid, padding: "4px 20px 16px" }}>
                      <span>Applied: <strong style={{ color: C.green }}>{fmt(calc.proceedsApplied)}</strong></span>
                      <span>You keep: <strong style={{ color: C.blue }}>{fmt(calc.proceedsKept)}</strong></span>
                    </div>
                  </>
                )}

                {!isSellFirst && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 16px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: C.mid, fontFamily: SF }}>Applied to new mortgage</span>
                  <span style={{ fontSize: "19px", fontWeight: 800, color: C.green, fontFamily: SF }}>{fmt(calc.proceedsApplied)}</span>
                </div>}

                {isBuyFirst && affordMode && (
                  <button onClick={() => setTab("new")} style={{ width: "100%", marginTop: "14px", padding: "13px", background: `linear-gradient(135deg,${C.blue},#8b1a8f)`, color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 800, fontFamily: SF, cursor: "pointer" }}>Done - Back to New Home</button>
                )}
              </Card>

              {!isSellFirst && (
                <Card accent={C.green}>
                  <SectionLabel color={C.green}>After Recast</SectionLabel>
                  {!recastEnabled && <Pill>Recast is off — original payment continues after sale.</Pill>}
                  <LineItem label={"Balance after " + overlapMonths + " mo"} value={fmt(calc.balAfterOverlap)} />
                  <LineItem label={"Proceeds applied (" + proceedsApplyPct + "%)"} value={"- " + fmt(calc.proceedsApplied)} color={C.green} />
                  {calc.proceedsKept > 0 && recastEnabled && <LineItem label="Proceeds kept" value={fmt(calc.proceedsKept)} color={C.blue} />}
                  <LineItem label="Recast principal" value={fmt(calc.recastPrincipal)} />
                  <LineItem label="Remaining term" value={calc.remainingTermMonths + " mo"} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: C.mid, fontFamily: SF }}>New monthly payment</span>
                    <span style={{ fontSize: "22px", fontWeight: 800, color: C.green, fontFamily: SF }}>{fmtFull(calc.recastTotal)}</span>
                  </div>
                  <div style={{ marginTop: "14px", background: C.pill, border: "none", borderRadius: "10px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: C.pillText, fontFamily: SF, letterSpacing: "0.08em", textTransform: "uppercase" }}>vs. original new payment</div>
                      <div style={{ fontSize: "13px", color: C.mid, fontFamily: SF }}>{fmtFull(calc.newTotal)} {">"} {fmtFull(calc.recastTotal)}</div>
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: calc.monthlySavings > 0 ? C.green : C.red, fontFamily: SF }}>{calc.monthlySavings > 0 ? "-" : "+"}{fmtFull(Math.abs(calc.monthlySavings))}/mo</div>
                  </div>
                </Card>
              )}

            </div>
          )}

          {/* ══ AMORT ═════════════════════════════════════════════════════════ */}
          {tab === "amort" && (
            <AmortTab
              principal={calc.principal} rate={rate} term={term} newPI={calc.newPI}
              overlapMonths={overlapMonths} recastPI={calc.recastPI} proceedsApplied={calc.proceedsApplied}
              extraPayment={extraPayment} setExtraPayment={setExtraPayment}
              loanStartMonth={loanStartMonth} loanStartYear={loanStartYear}
              setLoanStartMonth={setLoanStartMonth} setLoanStartYear={setLoanStartYear}
              refiEnabled={refiEnabled} setRefiEnabled={setRefiEnabled}
              refiMonth={refiMonth} setRefiMonth={setRefiMonth}
              refiYear={refiYear} setRefiYear={setRefiYear}
              refiRate={refiRate} setRefiRate={setRefiRate}
              refiTermYears={refiTermYears} setRefiTermYears={setRefiTermYears}
              monthlyEscrow={monthlyEscrow}
              manualRecasts={manualRecasts} setManualRecasts={setManualRecasts}
            />
          )}

          {/* ══ RESALE ════════════════════════════════════════════════════════ */}
          {tab === "resale" && (
            <div style={{ animation: "fadeIn 0.18s ease" }}>
              <Card>
                <SectionLabel>Future Resale Estimate</SectionLabel>
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.mid, fontFamily: SF, padding: "20px 20px 10px" }}>Age of Home at Sale</div>
                  <div style={{ display: "flex", gap: "8px", padding: "0 20px 20px" }}>
                    {AGE_RANGES.map(({ id, label, sub, mult }) => {
                      const active = homeAgeRange === id;
                      return (
                        <button key={id} onClick={() => setHomeAgeRange(id)} style={{ flex: "1 1 0", padding: "10px 4px", borderRadius: "10px", cursor: "pointer", border: "none", background: active ? C.pill : "rgba(120,80,160,0.08)", textAlign: "center", minWidth: 0, overflow: "hidden" }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: active ? C.pillAccent : C.text, fontFamily: SF, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 2px" }}>{label}</div>
                          <div style={{ fontSize: "10px", color: active ? C.pillText : C.dim, fontFamily: SF, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", padding: "0 2px" }}>{sub}</div>
                          <div style={{ fontSize: "10px", color: active ? C.pillAccent : C.dim, fontFamily: SF, fontWeight: 600, marginTop: "1px" }}>×{mult.toFixed(2)}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.mid, fontFamily: SF, padding: "20px 20px 10px" }}>Price Per Sqft</div>
                  <div style={{ display: "flex", gap: "10px", padding: "0 20px 20px" }}>
                    <button onClick={() => setPricingMode("today")} style={{ flex: 1, padding: "14px 12px", borderRadius: "10px", cursor: "pointer", border: "none", background: pricingMode === "today" ? C.pill : "rgba(120,80,160,0.08)", textAlign: "left" }}>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: pricingMode === "today" ? C.pillAccent : C.text, fontFamily: SF }}>${resaleCalc.basePpsf}/sqft</div>
                      <div style={{ fontSize: "12px", color: pricingMode === "today" ? C.pillText : C.dim, fontFamily: SF, marginTop: "2px" }}>Today's avg · hold constant</div>
                    </button>
                    <button onClick={() => setPricingMode("projected")} style={{ flex: 1, padding: "14px 12px", borderRadius: "10px", cursor: "pointer", border: "none", background: pricingMode === "projected" ? C.greenBg : "rgba(120,80,160,0.08)", textAlign: "left" }}>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: pricingMode === "projected" ? C.green : C.text, fontFamily: SF }}>${resaleCalc.projectedPpsf}/sqft</div>
                      <div style={{ fontSize: "12px", color: pricingMode === "projected" ? C.green : C.dim, fontFamily: SF, marginTop: "2px" }}>Projected · 2.5%/yr growth</div>
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.mid, fontFamily: SF, padding: "20px 20px 10px" }}>Projected Sale Date</div>
                  <div style={{ display: "flex", gap: "10px", padding: "0 20px 20px" }}>
                    <select value={resaleMonth} onChange={e => setResaleMonth(Number(e.target.value))} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }}>
                      {MONTHS_ABBR.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                    </select>
                    <select value={resaleYear} onChange={e => setResaleYear(Number(e.target.value))} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", fontFamily: SF, fontSize: "15px", background: "rgba(120,80,160,0.08)", color: C.text, outline: "none" }}>
                      {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() + i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, padding: "0 20px 8px" }}>{ownedLabel} from loan start ({MONTHS_ABBR[loanStartMonth - 1]} {loanStartYear})</div>
                </div>
              </Card>
              <Card accent={C.green}>
                <SectionLabel color={C.green}>Projected Resale Proceeds</SectionLabel>
                <LineItem label={"Est. value (" + newHomeSqft.toLocaleString() + " sqft x $" + resaleCalc.activePpsf + (pricingMode === "projected" ? " proj." : "") + ")"} value={fmt(resaleCalc.projectedPrice)} />
                <LineItem label={"Selling costs (" + resaleCalc.totalSellPct.toFixed(1) + "%)"} value={"- " + fmt(resaleCalc.sellingCostsDollar)} color={C.red} />
                <LineItem label={"Loan balance at " + ownedLabel} value={"- " + fmt(resaleCalc.balanceAtSale)} color={C.red} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 8px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: C.mid, fontFamily: SF }}>Net proceeds</span>
                  <span style={{ fontSize: "26px", fontWeight: 700, color: C.green, fontFamily: SF }}>{fmt(resaleCalc.netResaleProceeds)}</span>
                </div>
                <div style={{ background: C.pill, borderRadius: "12px", margin: "0 20px 20px", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: C.pillText, fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>vs. purchase price</div>
                    <div style={{ fontSize: "14px", color: C.mid, fontFamily: SF }}>{fmt(homePrice)} {">"} {fmt(resaleCalc.projectedPrice)}</div>
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: resaleCalc.equityGain >= 0 ? C.green : C.red, fontFamily: SF }}>{resaleCalc.equityGain >= 0 ? "+" : ""}{fmt(resaleCalc.equityGain)}</div>
                </div>
              </Card>
            </div>
          )}

          {/* ══ SUMMARY ═══════════════════════════════════════════════════════ */}
          {tab === "summary" && (
            <div style={{ animation: "fadeIn 0.18s ease" }}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "12px", color: C.dim, fontFamily: SF, letterSpacing: "0.08em" }}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {isFirstHome ? "First Home" : isSellFirst ? "Sell First" : "Buy First"}</div>
              </div>
              {[
                { color: "#c0166a", label: "① New Mtg",       val: fmtFull(calc.newTotal),        sub: fmt(homePrice) + " · " + (downMode === "dollar" ? ((downDollars / homePrice) * 100).toFixed(0) : downPct) + "% dn · " + rate.toFixed(2) + "% · " + term + "yr", extra: calc.needsPMI ? "PMI " + fmtFull(calc.monthlyPMI) + "/mo" : "" },
                { color: "#6d1fa0", label: "② Overlap " + overlapMonths + "mo", val: fmtFull(calc.combinedMonthly), sub: "New " + fmtFull(calc.newTotal) + " + " + fmtFull(currentPayment), extra: "Total " + fmt(calc.totalBridgeCost) },
                { color: "#0b6e6e", label: "③ Sale Proceeds", val: fmt(calc.netProceeds),         sub: fmt(salePrice) + " sale",                                                                    extra: "Costs " + calc.totalSellingPct.toFixed(1) + "% · Payoff " + fmt(currentBalance) },
                { color: "#0b8f8f", label: "④ After Recast",  val: fmtFull(calc.recastTotal) + "/mo", sub: "Bal " + fmt(calc.recastPrincipal),                                                  extra: "Save " + fmtFull(calc.monthlySavings) + "/mo" },
                { color: "#8b1a8f", label: "⑤ Resale " + (resaleCalc.yrs > 0 ? resaleCalc.yrs + "yr" : "") + (resaleCalc.mos > 0 ? " " + resaleCalc.mos + "mo" : ""), val: fmt(resaleCalc.netResaleProceeds), sub: newHomeSqft.toLocaleString() + " sqft · $" + resaleCalc.activePpsf + "/ft", extra: "Est. " + fmt(resaleCalc.projectedPrice) },
                { color: "#a01660", label: "⑥ Total Interest", val: (() => { const mr2 = rate/100/12; let b = calc.principal, tot = 0, pi = calc.newPI, rp = calc.recastPI || pi; for (let m = 0; m < term*12 && b > 0.01; m++) { if (m === overlapMonths) { b = Math.max(0, b - calc.proceedsApplied); pi = rp; } const ic = b*mr2; b = Math.max(0, b - Math.min(b, pi - ic + extraPayment)); tot += ic; } return fmt(tot); })(), sub: "Over loan life", extra: extraPayment > 0 ? "+" + fmt(extraPayment) + "/mo extra" : "" },
              ].reduce((rows, item, i) => { if (i % 2 === 0) rows.push([item]); else rows[rows.length - 1].push(item); return rows; }, []).map((pair, ri) => (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                  {pair.map(({ color, label, val, sub, extra }) => (
                    <div key={label} style={{ background: color, borderRadius: "12px", padding: "0.7rem 12px" }}>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontFamily: SF, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", fontFamily: SF, lineHeight: 1.1, marginTop: "2px" }}>{val}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.80)", fontFamily: SF, fontWeight: 600, marginTop: "6px" }}>{sub}</div>
                      {extra && <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontFamily: SF }}>{extra}</div>}
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ textAlign: "center", background: C.pill, border: "none", borderRadius: "8px", padding: "10px 16px", fontSize: "12px", color: C.pillText, fontFamily: SF, letterSpacing: "0.06em", marginBottom: "14px" }}>Screenshot to save · All values from your inputs</div>
              <button onClick={saveScenario} style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg,${C.blue},#8b1a8f)`, color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 800, fontFamily: SF, cursor: "pointer" }}>Save This Scenario</button>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", fontSize: "11px", color: C.dim, fontFamily: SF, letterSpacing: "0.04em", marginTop: "14px", lineHeight: 1.7, padding: "0 8px 120px" }}>
            {"© 2025 Domavi Mortgage™ · All rights reserved · For informational purposes only · Not financial, legal, or lending advice · Tax data: Tax Foundation 2024 · Consult a licensed lender and agent for actual figures"}
          </div>

        </div>
      </div>

      {/* ── Fixed Bottom Tab Dock ─────────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "480px", zIndex: 50, background: "rgba(245,240,247,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "0.5px solid rgba(60,0,80,0.12)", paddingBottom: "env(safe-area-inset-bottom,16px)" }}>
        <div style={{ display: "flex", alignItems: "stretch" }}>

          {/* Back button */}
          <button onClick={() => prevTab && goToTab(prevTab)} disabled={!prevTab}
            style={{ width: "64px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 0", background: "none", border: "none", borderRight: "0.5px solid rgba(60,0,80,0.10)", cursor: prevTab ? "pointer" : "default", opacity: prevTab ? 1 : 0.2 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Tab labels */}
          <div style={{ flex: 1, display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
            {TABS.map(t => {
              const active = t.id === tab;
              return (
                <button key={t.id} onClick={() => goToTab(t.id)}
                  style={{ flex: "0 0 auto", minWidth: "60px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 10px 10px", background: "none", border: "none", cursor: "pointer", position: "relative" }}>
                  {active && <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "2.5px", borderRadius: "0 0 2px 2px", background: C.blue }} />}
                  <span style={{ fontSize: "11px", fontWeight: active ? 700 : 400, color: active ? C.blue : C.dim, fontFamily: SF, whiteSpace: "nowrap", marginTop: "4px" }}>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button onClick={() => nextTab && goToTab(nextTab)} disabled={!nextTab}
            style={{ width: "64px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 0", background: "none", border: "none", borderLeft: "0.5px solid rgba(60,0,80,0.10)", cursor: nextTab ? "pointer" : "default", opacity: nextTab ? 1 : 0.2 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={nextTab ? C.blue : C.dim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

        </div>
      </div>

    </div>
  );
}
