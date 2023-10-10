# Apple Profile and Certificate Documentation

The App Coordinator has an apple developer account which is used to manage all
the certificates and profiles for the app. The certificates and profiles are
used to sign the dev client and allow it to be installed on devices, as well as
allowing us to distribute the app to the app store.

A broad overview of these concepts can be found on the
[Expo docs website](https://docs.expo.dev/app-signing/app-credentials/#ios)

## Distribution Certificate

The distribution certificate is used to sign the app when it is distributed to
the app store. It can be created and managed by `eas credentials`. The
certificate has an expiry date, and when it expires it must be renewed and
updated in Expo.

## Production Provisioning Profile

The production profile is used by the app store to verify that the app has been
signed by a trusted source. It can be created and managed by `eas credentials`.

## Ad-Hoc Provisioning Profile

The ad-hoc profile is used by the DB Dev Client App (`expo-dev-client`) and
allows it to be installed on devices directly. The nature of an ad-hoc profile
means it only works on certain devices which have been registered with apple
beforehand. Registering a device requires knowing its UDID. This unique string
can be found using Expo's tools, described on their
[Create a Build](https://docs.expo.dev/develop/development-builds/create-a-build/#create-a-build-for-the-device)
documentation. Running `eas device:create` will allow you to create a link that
members of the committee can use to enroll their device with expo. Once everyone
has enrolled their devices you can run `eas device:list` to see the UDIDs of all
the devices. These can then be added to the ad-hoc profile on the apple
developer portal.

Note that UK only gets a limited number of registered devices, and the list can
grow quite long, so make sure to clear out the UDIDs of devices that are no
longer used both via Expo and Apple. To remove a device from expo you can use
the `eas device:delete` command, and for apple you can use the
[developer portal](https://developer.apple.com/account/resources/devices/list).

Once you have registered all the devices you want to run the dev client on you
can add them to the developer portal. On the device list page click the blue
plus icon to add a new device. Copy the UDID from the output of
`eas device:list` and paste it into the UDID field. Give the device a name in
the form 'UKDB iPhone - DB[YEAR] [COMMITTEE TITLE] - [PERSON NAME]' such as
'UKDB iPhone - DB24 App Coordinator - Tag Howard'.
