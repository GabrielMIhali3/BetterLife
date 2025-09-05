from math import radians, sin, cos, sqrt, atan2

class GetStoresLocation:
    def __init__(self):
        self.shops = {
                        'Kaufland': [ [46.75941951229104, 23.563822009943316], [46.78245927642147, 23.61455092578851], [46.76964580220791, 23.629443030869442], [46.78142922020432, 23.636282688212212] ],
                        'Auchan': [ [46.773135942240316, 23.629176733597387], [46.799384348997485, 23.61094872449209], [46.774107966643896, 23.62074623901809] ],
                        'Profi': [ [46.77755311097351, 23.61591928092353], [46.77610877656583, 23.621146609037137], [46.76737699721175, 23.624690544217493], [46.78296751351009, 23.622785589019877], [46.778071883346875, 23.611479239212557], [46.781262299608855, 23.626174841948814], [46.782034294513046, 23.6273585135278], [46.78144537438772, 23.608714077036982], [46.77632412393037, 23.628359048331504], [46.76940576057044, 23.61595176797366] ],
                        'Mega Image': [ [46.78127874371725, 23.623295012091415] ,[46.77960130447958, 23.60554795730243], [46.78032872688337, 23.614147345580296], [46.78201467454193, 23.612081877434154], [46.78050686274844, 23.626938460506647], [46.78853633387881, 23.614838857794247], [46.7701872946509, 23.593221990373838], [46.77083547435033, 23.617387764982613], [46.77747903439281, 23.62901301606106] ],
                        'Carrefour': [ [46.778516250267494, 23.61818088199501], [46.77877116449924, 23.604213513334486], [46.75945806290126, 23.614485821510797], [46.78463644011646, 23.58842026150406], [46.761340751783635, 23.61385835191029], [46.76784429584017, 23.602803247613007], [46.75031858213115, 23.533764484919214], [46.78073457303457, 23.613570873832032], [46.776477749475575, 23.629992768867783], [46.779060223365235, 23.614822211606832] ]
                    }
    def distance(self, lat1, lon1, lat2, lon2):
        # Convert latitude and longitude from degrees to radians
        lat1 = radians(lat1)
        lon1 = radians(lon1)
        lat2 = radians(lat2)
        lon2 = radians(lon2)

        # Haversine formula to calculate the distance
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = 6371 * c  # Radius of Earth in kilometers. Use 3956 for miles

        return distance

    def get_nearest_store(self, current_coordinates, stores):
        print(current_coordinates)
        print(stores)
        lat, lon = current_coordinates[0], current_coordinates[1]
        nearest_store, dist, nearest_coordinates = None, 1e9, None
        for store in stores:
            for lat_store, lon_store in self.shops[store]:
                value = self.distance(lat, lon, lat_store, lon_store)
                if value < dist:
                    dist = value
                    nearest_store = store
                    nearest_coordinates = [lat_store, lon_store]
        return {nearest_store: [round(dist, 3), nearest_coordinates]}
