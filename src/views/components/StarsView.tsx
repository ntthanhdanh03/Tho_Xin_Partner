import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import FastImage from 'react-native-fast-image'
import { scaleModerate } from '../../styles/scaleDimensions'
import { ic_star, ic_star_yellow } from '../../assets'

interface IStar {
    number?: number
    type?: 'view' | 'action'
    onChange?: any
}
const StarsView = ({ number = 0, type = 'view', onChange }: IStar) => {
    const [selectedStars, setSelectedStars] = useState(1)
    return (
        <View style={{ flexDirection: 'row' }}>
            {type === 'view'
                ? [1, 2, 3, 4, 5]?.map((i) => {
                      if (i <= number) {
                          return <FastImage source={ic_star_yellow} style={styles.icon} key={i} />
                      }
                      return <FastImage source={ic_star} style={styles.icon} key={i} />
                  })
                : [1, 2, 3, 4, 5]?.map((i) => {
                      if (i <= selectedStars) {
                          return (
                              <TouchableOpacity
                                  key={i}
                                  onPress={() => {
                                      setSelectedStars(i)
                                      onChange && onChange(i)
                                  }}
                              >
                                  <FastImage source={ic_star_yellow} style={styles.iconAction} />
                              </TouchableOpacity>
                          )
                      }
                      return (
                          <TouchableOpacity
                              key={i}
                              onPress={() => {
                                  setSelectedStars(i)
                                  onChange && onChange(i)
                              }}
                          >
                              <FastImage source={ic_star} style={styles.iconAction} />
                          </TouchableOpacity>
                      )
                  })}
        </View>
    )
}

export default StarsView

const styles = StyleSheet.create({
    icon: {
        width: scaleModerate(24),
        aspectRatio: 1,
        marginLeft: scaleModerate(5),
    },
    iconAction: {
        width: scaleModerate(30),
        aspectRatio: 1,
        marginLeft: scaleModerate(15),
    },
})
