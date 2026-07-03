// Approximate [lat, lon] for each vendor slug — geocoded from addresses where available.
// Vendors with no address use village-centre or landmark approximations.
export const VENDOR_COORDS = {
  'edwin-county-farms': [44.1572, -77.1197], // 2590 County Rd 15, K0K 1W0 (north shore, near Carrying Place)
  'fiddlehead':         [44.0811, -77.1840], // Fish Lake Road, Demorestville / Sophiasburgh
  'lambs-quarters':     [44.0084, -77.1639], // 240 County Road 4
  'nomad-mushroom':     [44.00390732270795, -77.14934073205336], // 212 County Road 16, Black River
  'paper-kite':         [43.96822395760929, -77.03765473903154], // Black River
  'portico-gardens':    [43.9874, -77.2208], // 1465 County Road 2, near Bloomfield
  'ivyridge-honey-farm': [43.9874, -77.2208], // 1465 County Road 2 (operates from Portico Gardens)
  'return-to-earth':    [44.0092, -77.0534], // 1418 County Road 8
  'rorafresh':          [44.0489, -76.9655], // 1951 County Road 7, Cressy
  'scott-farms':        [43.9741, -77.4551], // Hillier (no address — village centre)
  'sunset-farms':       [44.1170, -77.2070], // 1397 County Road 15, Northport (no address in registry)
  'the-elmbrook-farm':  [44.0722, -77.1298], // 339 Elmbrook Road, Picton
  'van-stone-farms':    [44.0720, -76.8680], // near Rock Cross Road, Waupoos waterfront (no address)
  'vickis-veggies':     [43.9789, -77.0219], // 81 Morrison Point Road, Milford area
  'brackens':           [43.92918, -77.1463074], // 1927 County Road 10, Picton (Cherryvalley)
  'hellyer-organics':  [44.052746149125696, -76.94783980970087], // County Road 7, North Marysburg
}
