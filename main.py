import pandas as pd
import matplotlib.pyplot as plt
import folium
import json

# This is a conflict-year dataset with information on armed conflict where at least one party is the
# government of a state in the time period 1946-2024. 
df = pd.read_csv("UcdpPrioConflict_v25_1.csv")

# Code 1: Interstate Armed Conflict (India vs Pakistan, Iran-Iraq War)
# Code 2: Intrastate Armed Conflict (Civil War)
# Code 3: Internationalized Intrastate Conflict (External States intervene on one or both sides)
# Earlier persons designate these as 1, 2, 3 but v25.1, which is what I am using, designates them as
# 3, 4, 5

# Ensure year column is numeric
df["year"] = pd.to_numeric(df["year"], errors="coerce")

# Filter for Civil Wars
civil_wars = df[df["type_of_conflict"].isin([3, 4])] 

# Counting conflicts per country
conflict_by_country = df["location"].value_counts().reset_index()
conflict_by_country.columns = ["country", "num_conflicts"]

# Load map
world_map = "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/world-countries.json"

# Create map
m = folium.Map(location=[20, 0], zoom_start=2)

folium.Choropleth(
    geo_data=world_map,
    name="choropleth",
    data=conflict_by_country,
    columns=["country", "num_conflicts"],
    key_on="feature.properties.name",
    fill_color="YlOrRd",
    fill_opacity=0.7,
    line_opacity=0.2,
    legend_name="Number of Civil Wars (1946–2024)"
).add_to(m)

m.save("civil_wars_map.html")

# NUMBER OF UNIQUE CONFLICTS BY YEARS 
# conflict_by_year = df.groupby("year")["conflict_id"].nunique()

# Plot for Unique Conflicts
# conflict_by_year.plot(kind="line", title="Civil Wars by Year", marker='o')
# plt.xlabel("Year")
# plt.ylabel("Number of Civil Wars")
# plt.grid(True)
# plt.tight_layout()
# plt.show()