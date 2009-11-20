// ------------------------------------------------------------------------
//     Copyright 2009 Applied Research in Patacriticism and the University of Virginia
// 
//     Licensed under the Apache License, Version 2.0 (the "License");
//     you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
// 
//         http://www.apache.org/licenses/LICENSE-2.0
// 
//     Unless required by applicable law or agreed to in writing, software
//     distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//     limitations under the License.
// ----------------------------------------------------------------------------

/*global $, MessageBoxDlg */
/*extern expandSearchNameFacet, showAllSearchNameFacet, minimizeSearchNameFacet */

function expandSearchNameFacet() {
	var elMin = $('search_name_facet_min');
	var elMax = $('search_name_facet_max');
	elMin.addClassName('hidden');
	elMax.removeClassName('hidden');
}

function minimizeSearchNameFacet() {
	var elMin = $('search_name_facet_min');
	var elMax = $('search_name_facet_max');
	elMax.addClassName('hidden');
	elMin.removeClassName('hidden');
}

function showAllSearchNameFacet() {
	showPartialInLightBox("/search/list_name_facet_all", "All Names in Search");
}
