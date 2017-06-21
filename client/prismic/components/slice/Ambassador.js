import React from 'react'
import PropTypes from 'prop-types'
import Ambassador from '~/components/ambassador'
import { StructuredText } from '~/prismic/components/base'
import { parseGroup } from '~/prismic/parsers'

function transformer({
    avatar,
    avatarCredit,
    avatarCaption,
    banner,
    bannerCredit,
    bannerCaption,
    twitter,
    facebook,
    instagram,
    website,
    ...rest
}) {
    const socials = [twitter, facebook, instagram, website]

    return {
        ...rest,
        avatar: {
            src: avatar.main.url,
            credit: avatarCredit,
            caption: avatarCaption,
        },
        banner: {
            src: banner.main.url,
            credit: bannerCredit,
            caption: bannerCaption,
        },
        socials: socials.filter(Boolean).map(social => social.url),
    }
}

function createAmbassador({ biography, ...props }, index) {
    return (
        <Ambassador key={index} {...props}>
            <StructuredText value={biography} />
        </Ambassador>
    )
}

AmbassadorSet.propTypes = {
    value: PropTypes.arrayOf(PropTypes.object),
}

export default function AmbassadorSet(props) {
    return (
        <div>
            {parseGroup(props, undefined, transformer).map(createAmbassador)}
        </div>
    )
}