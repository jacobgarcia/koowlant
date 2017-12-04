# KawlantID

# Usage

## Send site reports
First will need a site token (jwt), you can generate one on /v1/site-token POST, passing your user token (must be access 3) and it will return a site token.

Then simply make a PUT request to /v1/reports and the route will access the company and site key by the token and make the corresponding update.

## Codes

### User types

0 Main administrator
1
2
3
4

### Sensor types

0 Energy
1 Fuel
2 Temperature
3 Access
4

### Sensor metric type
0 Number
1 Percentage
2 Degrees
