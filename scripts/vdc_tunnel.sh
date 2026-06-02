#!/bin/bash
# Pull and execute the latest tunnel-setup script straight from VDC.
# The ?app= parameter tells VDC which Application's tunnel port to use
# so multiple Emergent pods don't fight over the same port.
curl -sSL -H "X-API-Key: clara_MOOD_VmR_BUgjqyr5a0WskgwvkGvwTXcjNRCDxxDdOs" \
  "https://vdc.koodh.com/api/clara/tunnel-setup-script?app=44c88fca-71bc-4bbb-900e-a2ac59a840d2&raw=1" | bash
